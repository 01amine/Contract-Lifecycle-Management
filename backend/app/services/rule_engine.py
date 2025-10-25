import re
from typing import List, Dict, Any

RULE_CATEGORIES = {
    "HIGH_RISK_TERMS": "Detects specific high-risk or prohibited language.",
    "MISSING_ELEMENTS": "Checks for the absence of mandatory structural elements or keywords.",
    "FORMAT_CONSISTENCY": "Ensures data points and formatting conform to standards.",
}

class RuleEngineService:

    def __init__(self, logger: Any = None):
        self.logger = logger if logger else print

    def _get_all_rules(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "R001",
                "category": "HIGH_RISK_TERMS",
                "description": "Flag unlimited liability language.",
                "check": lambda clause: "unlimited liability" in clause.lower(),
                "flag_message": "Clause contains 'Unlimited Liability', which is highly restricted.",
            },
            {
                "id": "R002",
                "category": "HIGH_RISK_TERMS",
                "description": "Flag explicit one-sided termination language (e.g., 'Party A may terminate... Party B may not.').",
                "check": lambda clause: re.search(r"Party \w may terminate.*Party \w cannot", clause, re.IGNORECASE),
                "flag_message": "Clause suggests a significantly unbalanced termination right.",
            },
            {
                "id": "R003",
                "category": "MISSING_ELEMENTS",
                "description": "In Indemnity clauses, verify the presence of the word 'indemnify'.",
                "check": lambda clause, clause_type, **kwargs: clause_type == 'INDEMNITY' and 'indemnify' not in clause.lower(),
                "flag_message": "Indemnity clause may be missing the key operative word 'indemnify'.",
            },
            {
                "id": "R004",
                "category": "FORMAT_CONSISTENCY",
                "description": "Check if a number greater than 1000 appears without a currency symbol ($€£).",
                "check": lambda clause: re.search(r'(?<![\$€£])\s\d{4,}', clause),
                "flag_message": "Potential monetary amount detected without an explicit currency denomination.",
            },
        ]

    def apply_rules(self, clause_text: str, clause_context: Dict[str, Any] = None) -> List[Dict[str, str]]:
        if not clause_text or not isinstance(clause_text, str):
            self.logger("Error: Invalid clause text provided to RuleEngineService.")
            return []

        triggered_flags = []
        clause_context = clause_context if clause_context is not None else {}

        for rule in self._get_all_rules():
            try:
                # FIX: Check if the function expects more than 1 positional argument (i.e., needs context)
                num_total_positional_args = rule["check"].__code__.co_argcount 

                if num_total_positional_args > 1:
                    # Execute context-aware rule, passing clause_text positionally and context keywords
                    is_triggered = rule["check"](clause_text, **clause_context)
                else:
                    # Execute simple rule
                    is_triggered = rule["check"](clause_text)

                if is_triggered:
                    flag = {
                        "rule_id": rule["id"],
                        "category": rule["category"],
                        "description": rule["description"],
                        "flag": rule["flag_message"],
                    }
                    triggered_flags.append(flag)

            except Exception as e:
                self.logger(f"Error executing rule {rule['id']} on clause: {e}")

        return triggered_flags