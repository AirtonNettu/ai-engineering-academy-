"""Audit gate: 0 accepted, 1 blocking findings, 2 tool/incomplete report error."""

import json
import sys
from pathlib import Path


def evaluate(ecosystem, status, report):
    try:
        if status not in (0, 1) or not isinstance(report, dict) or "error" in report:
            raise ValueError("ferramenta falhou ou retornou erro")
        if ecosystem == "npm":
            counts = report["metadata"]["vulnerabilities"]
            levels = ("info", "low", "moderate", "high", "critical")
            if any(type(counts[k]) is not int or counts[k] < 0 for k in (*levels, "total")):
                raise ValueError("contagens inválidas")
            total = sum(counts[k] for k in levels)
            if counts["total"] != total:
                raise ValueError("total inconsistente")
            blocked = counts["high"] + counts["critical"]
            detail = ", ".join(f"{k}={counts[k]}" for k in levels)
        elif ecosystem == "python":
            dependencies = report["dependencies"]
            if not isinstance(dependencies, list) or not dependencies:
                raise ValueError("lista de dependências ausente ou vazia")
            total = 0
            for dependency in dependencies:
                if not dependency.get("name") or not dependency.get("version") or "skip_reason" in dependency:
                    raise ValueError("dependência não auditada")
                vulns = dependency["vulns"]
                if not isinstance(vulns, list) or any(
                    not isinstance(v, dict) or not isinstance(v.get("id"), str) or not v["id"]
                    for v in vulns
                ):
                    raise ValueError("lista de achados inválida")
                total += len(vulns)
            blocked = total
            detail = f"{total} achados; severidade não fornecida pelo pip-audit"
        else:
            raise ValueError("ecossistema desconhecido")
        if status != int(total > 0):
            raise ValueError("exit code e relatório discordam")
        if blocked:
            return 1, f"{ecosystem}: ACHADOS BLOQUEANTES — {detail}. Consultar artefatos e realizar triagem."
        if total:
            return 0, f"{ecosystem}: AVISO — {detail}. Registrar triagem; abaixo do gate high/critical."
        return 0, f"{ecosystem}: nenhum achado conhecido no relatório completo."
    except (KeyError, TypeError, AttributeError, ValueError) as error:
        return 2, f"{ecosystem}: ERRO DE FERRAMENTA/RELATÓRIO — {error}. Não comprova ausência de vulnerabilidades."


def main():
    ecosystem, status, path = sys.argv[1:]
    try:
        report = json.loads(Path(path).read_text(encoding="utf-8"))
        code, message = evaluate(ecosystem, int(status), report)
    except (OSError, ValueError) as error:
        code, message = 2, f"{ecosystem}: ERRO DE FERRAMENTA/RELATÓRIO — {error}"
    print(message)
    # Only fixed messages are emitted; advisory content remains in the raw artifact.
    if code:
        print("::error::Auditoria bloqueada: " + ("achados" if code == 1 else "falha de ferramenta/relatório"))
    elif "AVISO" in message:
        print("::warning::Achados npm abaixo do gate; consulte o relatório e faça triagem.")
    return code


if __name__ == "__main__":
    sys.exit(main())
