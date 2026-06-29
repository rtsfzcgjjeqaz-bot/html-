import fs from "fs";
import { spawnSync } from "child_process";

export type MediaToolStatus =
  | "not_configured"
  | "candidate_empty"
  | "path_missing"
  | "candidate_is_directory"
  | "path_stat_failed"
  | "spawn_enoent"
  | "spawn_eacces"
  | "spawn_error"
  | "spawn_timeout"
  | "process_nonzero_exit"
  | "version_output_unrecognized"
  | "validated";

export type MediaToolchainPreflight = {
  toolchainStatus: "passed" | "unavailable" | "invalid";
  ffmpegAvailable: boolean;
  ffprobeAvailable: boolean;
  ffmpegExecutableValidated: boolean;
  ffprobeExecutableValidated: boolean;
  ffmpegVersionDetected: boolean;
  ffprobeVersionDetected: boolean;
  toolchainResolutionMode: "env_override" | "process_path" | "windows_where" | "unavailable";
  sanitizedFailureCategory?:
    | "FFMPEG_NOT_AVAILABLE"
    | "FFPROBE_NOT_AVAILABLE"
    | "MEDIA_TOOLCHAIN_INVALID"
    | "FFMPEG_PATH_MISSING"
    | "FFPROBE_PATH_MISSING"
    | "FFMPEG_CANDIDATE_IS_DIRECTORY"
    | "FFPROBE_CANDIDATE_IS_DIRECTORY"
    | "FFMPEG_PATH_STAT_FAILED"
    | "FFPROBE_PATH_STAT_FAILED"
    | "FFMPEG_SPAWN_ENOENT"
    | "FFPROBE_SPAWN_ENOENT"
    | "FFMPEG_SPAWN_EACCES"
    | "FFPROBE_SPAWN_EACCES"
    | "FFMPEG_SPAWN_ERROR"
    | "FFPROBE_SPAWN_ERROR"
    | "FFMPEG_SPAWN_TIMEOUT"
    | "FFPROBE_SPAWN_TIMEOUT"
    | "FFMPEG_NONZERO_EXIT"
    | "FFPROBE_NONZERO_EXIT"
    | "FFMPEG_VERSION_UNRECOGNIZED"
    | "FFPROBE_VERSION_UNRECOGNIZED";
  ffmpegStatus: MediaToolStatus;
  ffprobeStatus: MediaToolStatus;
  ffmpegFailureCategory?: string;
  ffprobeFailureCategory?: string;
  ffmpegExitCode: number | null;
  ffprobeExitCode: number | null;
  ffmpegTimedOut: boolean;
  ffprobeTimedOut: boolean;
  ffmpegCandidateConfigured: boolean;
  ffprobeCandidateConfigured: boolean;
  ffmpegCandidateExists: boolean | null;
  ffprobeCandidateExists: boolean | null;
  ffmpegCandidateIsFile: boolean | null;
  ffprobeCandidateIsFile: boolean | null;
  ffmpegSpawnAttempted: boolean;
  ffprobeSpawnAttempted: boolean;
  ffmpegStdoutPresent: boolean;
  ffprobeStdoutPresent: boolean;
  ffmpegStderrPresent: boolean;
  ffprobeStderrPresent: boolean;
};

type ToolName = "ffmpeg" | "ffprobe";

type ResolvedTool = {
  available: boolean;
  resolutionMode: "env_override" | "process_path" | "windows_where" | "unavailable";
  executableValidated: boolean;
  versionDetected: boolean;
  status: MediaToolStatus;
  failureCategory?: string;
  exitCode: number | null;
  timedOut: boolean;
  candidateConfigured: boolean;
  candidateExists: boolean | null;
  candidateIsFile: boolean | null;
  spawnAttempted: boolean;
  stdoutPresent: boolean;
  stderrPresent: boolean;
};

function stripOuterQuotes(value: string) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function statusToFailureCategory(tool: ToolName, status: MediaToolStatus) {
  if (status === "validated" || status === "not_configured" || status === "candidate_empty") return undefined;
  const prefix = tool.toUpperCase();
  const suffixByStatus: Record<Exclude<MediaToolStatus, "validated" | "not_configured" | "candidate_empty">, string> = {
    path_missing: "PATH_MISSING",
    candidate_is_directory: "CANDIDATE_IS_DIRECTORY",
    path_stat_failed: "PATH_STAT_FAILED",
    spawn_enoent: "SPAWN_ENOENT",
    spawn_eacces: "SPAWN_EACCES",
    spawn_error: "SPAWN_ERROR",
    spawn_timeout: "SPAWN_TIMEOUT",
    process_nonzero_exit: "NONZERO_EXIT",
    version_output_unrecognized: "VERSION_UNRECOGNIZED",
  };
  return `${prefix}_${suffixByStatus[status]}`;
}

function classifySpawnError(code: unknown): MediaToolStatus {
  if (code === "ENOENT") return "spawn_enoent";
  if (code === "EACCES" || code === "EPERM") return "spawn_eacces";
  if (code === "ETIMEDOUT") return "spawn_timeout";
  return "spawn_error";
}

function validateCandidate(input: { tool: ToolName; candidate: string; resolutionMode: ResolvedTool["resolutionMode"]; pathCandidate: boolean }): ResolvedTool {
  const candidate = stripOuterQuotes(input.candidate);
  if (!candidate) {
    return emptyTool(input.resolutionMode, "candidate_empty", true);
  }

  let candidateExists: boolean | null = null;
  let candidateIsFile: boolean | null = null;
  if (input.pathCandidate) {
    candidateExists = fs.existsSync(candidate);
    if (!candidateExists) {
      return failedBeforeSpawn(input.tool, input.resolutionMode, "path_missing", { candidateExists, candidateIsFile });
    }
    try {
      const stat = fs.statSync(candidate);
      candidateIsFile = stat.isFile();
      if (!candidateIsFile) {
        return failedBeforeSpawn(input.tool, input.resolutionMode, "candidate_is_directory", { candidateExists, candidateIsFile });
      }
    } catch {
      return failedBeforeSpawn(input.tool, input.resolutionMode, "path_stat_failed", { candidateExists, candidateIsFile });
    }
  }

  const spawned = spawnSync(candidate, ["-version"], {
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    timeout: 8000,
  });
  const stdoutPresent = Boolean(spawned.stdout);
  const stderrPresent = Boolean(spawned.stderr);
  const timedOut = spawned.error && (spawned.error as NodeJS.ErrnoException).code === "ETIMEDOUT";
  if (spawned.error) {
    const status = classifySpawnError((spawned.error as NodeJS.ErrnoException).code);
    return {
      available: false,
      resolutionMode: input.resolutionMode,
      executableValidated: false,
      versionDetected: false,
      status,
      failureCategory: statusToFailureCategory(input.tool, status),
      exitCode: typeof spawned.status === "number" ? spawned.status : null,
      timedOut: Boolean(timedOut),
      candidateConfigured: true,
      candidateExists,
      candidateIsFile,
      spawnAttempted: true,
      stdoutPresent,
      stderrPresent,
    };
  }

  if (spawned.status !== 0) {
    return {
      available: false,
      resolutionMode: input.resolutionMode,
      executableValidated: false,
      versionDetected: false,
      status: "process_nonzero_exit",
      failureCategory: statusToFailureCategory(input.tool, "process_nonzero_exit"),
      exitCode: typeof spawned.status === "number" ? spawned.status : null,
      timedOut: false,
      candidateConfigured: true,
      candidateExists,
      candidateIsFile,
      spawnAttempted: true,
      stdoutPresent,
      stderrPresent,
    };
  }

  const combinedOutput = `${spawned.stdout ?? ""}\n${spawned.stderr ?? ""}`;
  const versionDetected = new RegExp(`${input.tool}\\s+version`, "i").test(combinedOutput);
  if (!versionDetected) {
    return {
      available: false,
      resolutionMode: input.resolutionMode,
      executableValidated: false,
      versionDetected: false,
      status: "version_output_unrecognized",
      failureCategory: statusToFailureCategory(input.tool, "version_output_unrecognized"),
      exitCode: 0,
      timedOut: false,
      candidateConfigured: true,
      candidateExists,
      candidateIsFile,
      spawnAttempted: true,
      stdoutPresent,
      stderrPresent,
    };
  }

  return {
    available: true,
    resolutionMode: input.resolutionMode,
    executableValidated: true,
    versionDetected: true,
    status: "validated",
    exitCode: 0,
    timedOut: false,
    candidateConfigured: true,
    candidateExists,
    candidateIsFile,
    spawnAttempted: true,
    stdoutPresent,
    stderrPresent,
  };
}

function emptyTool(
  resolutionMode: ResolvedTool["resolutionMode"],
  status: MediaToolStatus,
  candidateConfigured = false,
  extra: Partial<Pick<ResolvedTool, "candidateExists" | "candidateIsFile">> = {},
): ResolvedTool {
  return {
    available: false,
    resolutionMode,
    executableValidated: false,
    versionDetected: false,
    status,
    exitCode: null,
    timedOut: false,
    candidateConfigured,
    candidateExists: extra.candidateExists ?? null,
    candidateIsFile: extra.candidateIsFile ?? null,
    spawnAttempted: false,
    stdoutPresent: false,
    stderrPresent: false,
  };
}

function failedBeforeSpawn(
  tool: ToolName,
  resolutionMode: ResolvedTool["resolutionMode"],
  status: Exclude<MediaToolStatus, "validated" | "not_configured" | "candidate_empty" | "spawn_enoent" | "spawn_eacces" | "spawn_error" | "spawn_timeout" | "process_nonzero_exit" | "version_output_unrecognized">,
  extra: Partial<Pick<ResolvedTool, "candidateExists" | "candidateIsFile">>,
): ResolvedTool {
  return {
    ...emptyTool(resolutionMode, status, true, extra),
    failureCategory: statusToFailureCategory(tool, status),
  };
}

function whereExecutable(command: ToolName) {
  const result = spawnSync("where.exe", [command], {
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    timeout: 5000,
  });
  if (result.error || result.status !== 0 || !result.stdout) return undefined;
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
}

function resolveTool(command: ToolName, envName: "FFMPEG_PATH" | "FFPROBE_PATH"): ResolvedTool {
  const envValue = process.env[envName];
  if (envValue !== undefined) {
    return validateCandidate({ tool: command, candidate: envValue, resolutionMode: "env_override", pathCandidate: true });
  }

  const processPathResult = validateCandidate({ tool: command, candidate: command, resolutionMode: "process_path", pathCandidate: false });
  if (processPathResult.available) return processPathResult;

  const whereResult = whereExecutable(command);
  if (whereResult) {
    return validateCandidate({ tool: command, candidate: whereResult, resolutionMode: "windows_where", pathCandidate: true });
  }

  return emptyTool("unavailable", "not_configured");
}

function aggregateFailure(ffmpeg: ResolvedTool, ffprobe: ResolvedTool): MediaToolchainPreflight["sanitizedFailureCategory"] {
  if (ffmpeg.available && ffprobe.available) return undefined;
  if (ffmpeg.failureCategory) return ffmpeg.failureCategory as MediaToolchainPreflight["sanitizedFailureCategory"];
  if (ffprobe.failureCategory) return ffprobe.failureCategory as MediaToolchainPreflight["sanitizedFailureCategory"];
  if (!ffmpeg.candidateConfigured) return "FFMPEG_NOT_AVAILABLE";
  if (!ffprobe.candidateConfigured) return "FFPROBE_NOT_AVAILABLE";
  return "MEDIA_TOOLCHAIN_INVALID";
}

export function runMediaToolchainPreflight(): MediaToolchainPreflight {
  const ffmpeg = resolveTool("ffmpeg", "FFMPEG_PATH");
  const ffprobe = resolveTool("ffprobe", "FFPROBE_PATH");
  const bothAvailable = ffmpeg.available && ffprobe.available;
  const anyCandidate = ffmpeg.candidateConfigured || ffprobe.candidateConfigured;
  const toolchainResolutionMode = ffmpeg.resolutionMode !== "unavailable" ? ffmpeg.resolutionMode : ffprobe.resolutionMode;
  return {
    toolchainStatus: bothAvailable ? "passed" : anyCandidate ? "invalid" : "unavailable",
    ffmpegAvailable: ffmpeg.available,
    ffprobeAvailable: ffprobe.available,
    ffmpegExecutableValidated: ffmpeg.executableValidated,
    ffprobeExecutableValidated: ffprobe.executableValidated,
    ffmpegVersionDetected: ffmpeg.versionDetected,
    ffprobeVersionDetected: ffprobe.versionDetected,
    toolchainResolutionMode: bothAvailable || anyCandidate ? toolchainResolutionMode : "unavailable",
    sanitizedFailureCategory: aggregateFailure(ffmpeg, ffprobe),
    ffmpegStatus: ffmpeg.status,
    ffprobeStatus: ffprobe.status,
    ffmpegFailureCategory: ffmpeg.failureCategory,
    ffprobeFailureCategory: ffprobe.failureCategory,
    ffmpegExitCode: ffmpeg.exitCode,
    ffprobeExitCode: ffprobe.exitCode,
    ffmpegTimedOut: ffmpeg.timedOut,
    ffprobeTimedOut: ffprobe.timedOut,
    ffmpegCandidateConfigured: ffmpeg.candidateConfigured,
    ffprobeCandidateConfigured: ffprobe.candidateConfigured,
    ffmpegCandidateExists: ffmpeg.candidateExists,
    ffprobeCandidateExists: ffprobe.candidateExists,
    ffmpegCandidateIsFile: ffmpeg.candidateIsFile,
    ffprobeCandidateIsFile: ffprobe.candidateIsFile,
    ffmpegSpawnAttempted: ffmpeg.spawnAttempted,
    ffprobeSpawnAttempted: ffprobe.spawnAttempted,
    ffmpegStdoutPresent: ffmpeg.stdoutPresent,
    ffprobeStdoutPresent: ffprobe.stdoutPresent,
    ffmpegStderrPresent: ffmpeg.stderrPresent,
    ffprobeStderrPresent: ffprobe.stderrPresent,
  };
}
