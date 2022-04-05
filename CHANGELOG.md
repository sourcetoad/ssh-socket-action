# v1.2.0 (April 4, 2022)
 * CVE-2020-7598 - Prototype Pollution.
 * CVE-2022-0235 - Sensitive Information exposure.
 * Introduce `lifetime` parameter to expire key.
 * Support Self Runners
 * Cleanups `known_hosts` (of selected domain) prior to adding entries.
 * Upgrade to Node16
 * Swapped `ncc` package to `@vercel/ncc` and included source maps + licenses.
 * Expose `SSH_AGENT_PID` if possible to obtain.
 * Expose `SSH_AUTH_SOCK` to location of `ssh-agent` sock file.

# v1.1.2 (September 16, 2021)
 * Support a filesystem with `~/.ssh` already present. (Fixes #19)
 * Add MIT license
 * CVE-2021-23343 - Regular Expression Denial of Service
 * CVE-2021-37713 - Arbitrary File Creation/Overwrite via insufficient symlink protection

# v1.1.1 (January 14, 2021)
 * CVE-2020-15228 - Environment variable injection
 * CVE-2020-8116 - Prototype Pollution
 * CVE-2020-15168 - Buffer over read
 * CVE-2020-7788 - Prototype Pollution
 * CVE-2020-15095 - Sensitive information exposure  
 * GHSA-xgh6-85xh-479p - Regular Expression Denial of Service  
 * JEST-62 - Prepare for publishing

# v1.1.0 (May 11, 2020)
 * PMW-41 - Add SSH port option.
 
# v1.0.1 (May 6, 2020)
 * PMW-41 - Fix shell command.
 
# v1.0.0 (May 5, 2020)
 * PMW-41 - Initial creation.
