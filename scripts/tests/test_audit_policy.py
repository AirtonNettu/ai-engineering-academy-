import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "audit_policy", Path(__file__).parents[1] / "audit-policy.py"
)
policy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(policy)


def npm(**counts):
    levels = dict(info=0, low=0, moderate=0, high=0, critical=0)
    levels.update(counts)
    return {"metadata": {"vulnerabilities": {**levels, "total": sum(levels.values())}}}


class AuditPolicyTests(unittest.TestCase):
    def test_cli_preserves_distinct_failure_codes_and_rejects_bad_json(self):
        with tempfile.TemporaryDirectory() as directory:
            report = Path(directory) / "report.json"
            for contents, status, expected in [
                (json.dumps(npm(high=1)), "1", 1),
                ("not json", "1", 2),
                (json.dumps(npm()), "0", 0),
            ]:
                report.write_text(contents, encoding="utf-8")
                result = subprocess.run(
                    [sys.executable, str(Path(__file__).parents[1] / "audit-policy.py"), "npm", status, str(report)],
                    capture_output=True,
                )
                self.assertEqual(result.returncode, expected, result.stdout)

    def test_npm_severity_gate(self):
        for report, status, expected in [
            (npm(), 0, 0),
            (npm(low=2, moderate=1), 1, 0),
            (npm(high=1), 1, 1),
            (npm(critical=1), 1, 1),
        ]:
            with self.subTest(report=report):
                self.assertEqual(policy.evaluate("npm", status, report)[0], expected)

    def test_exit_one_is_not_evidence_of_findings(self):
        for report in [{"error": {"code": "ENOAUDIT"}}, {}, npm()]:
            self.assertEqual(policy.evaluate("npm", 1, report)[0], 2)

    def test_malformed_or_inconsistent_npm_reports_fail_closed(self):
        invalid = []
        for value in [-1, "1", True]:
            report = npm()
            report["metadata"]["vulnerabilities"]["high"] = value
            invalid.append(report)
        report = npm()
        report["metadata"]["vulnerabilities"]["total"] = 3
        invalid.append(report)
        for report in invalid:
            self.assertEqual(policy.evaluate("npm", 1, report)[0], 2)
        self.assertEqual(policy.evaluate("npm", 0, npm(high=1))[0], 2)
        self.assertEqual(policy.evaluate("npm", 2, npm(high=1))[0], 2)

    def test_python_findings_block_without_inventing_severity(self):
        clean = {"dependencies": [{"name": "demo", "version": "1", "vulns": []}], "fixes": []}
        affected = {"dependencies": [{"name": "demo", "version": "1", "vulns": [{"id": "PYSEC-demo", "fix_versions": []}]}], "fixes": []}
        self.assertEqual(policy.evaluate("python", 0, clean)[0], 0)
        self.assertEqual(policy.evaluate("python", 1, affected)[0], 1)
        self.assertEqual(policy.evaluate("python", 0, affected)[0], 2)
        self.assertEqual(policy.evaluate("python", 1, clean)[0], 2)

    def test_python_incomplete_or_failed_audits_are_tool_errors(self):
        for report in [
            {}, {"dependencies": []},
            {"dependencies": [{"name": "demo", "skip_reason": "not found"}]},
            {"dependencies": [{"name": "demo", "version": "1", "vulns": [{}]}]},
        ]:
            with self.subTest(report=report):
                self.assertEqual(policy.evaluate("python", 1, report)[0], 2)


if __name__ == "__main__":
    unittest.main()
