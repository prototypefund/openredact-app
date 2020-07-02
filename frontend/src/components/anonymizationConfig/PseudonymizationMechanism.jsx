import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, InputGroup, NumericInput } from "@blueprintjs/core";
import PolyglotContext from "../../js/polyglotContext";

const PseudonymizationMechanism = ({
  mechanismConfig,
  updateMechanismConfig,
  tag,
}) => {
  const t = useContext(PolyglotContext);

  const [formatStringValid, setFormatStringValid] = useState(true);
  const [initialCounterValid, setInitialCounterValid] = useState(true);

  function validateFormatString(string) {
    const regex = RegExp("^[^{}]*{}[^{}]*$");
    return regex.test(string);
  }

  function onUpdateFormatString(value) {
    if (!validateFormatString(value)) {
      setFormatStringValid(false);
    } else {
      setFormatStringValid(true);
    }

    updateMechanismConfig({
      ...mechanismConfig,
      formatString: value,
    });
  }

  function validateInitialCounterValue(initialCounterValue) {
    return Number.isInteger(initialCounterValue) && initialCounterValue >= 1;
  }

  function onUpdateInitialCounterValue(valueAsNumber) {
    if (!validateInitialCounterValue(valueAsNumber)) {
      setInitialCounterValid(false);
      return;
    }

    setInitialCounterValid(true);
    updateMechanismConfig({
      ...mechanismConfig,
      initialCounterValue: valueAsNumber,
    });
  }

  return (
    <div>
      <FormGroup
        label={t("anonymization.pseudonymization.format_string")}
        helperText={
          formatStringValid
            ? undefined
            : t("anonymization.pseudonymization.format_string_hint")
        }
        intent={formatStringValid ? "default" : "danger"}
        labelFor={`${tag}-format-string-input`}
      >
        <InputGroup
          id={`${tag}-format-string-input`}
          value={mechanismConfig.formatString}
          onChange={(event) => onUpdateFormatString(event.target.value)}
          intent={formatStringValid ? "default" : "danger"}
          fill
        />
      </FormGroup>
      <FormGroup
        label={t("anonymization.pseudonymization.initial_counter_value")}
        labelFor={`${tag}-initial-counter-value-input`}
        helperText={
          initialCounterValid
            ? undefined
            : t("anonymization.pseudonymization.initial_counter_value_hint")
        }
        intent={initialCounterValid ? "default" : "danger"}
      >
        <NumericInput
          id={`${tag}-initial-counter-value-input`}
          min={1}
          minorStepSize={1}
          value={mechanismConfig.initialCounterValue}
          onValueChange={onUpdateInitialCounterValue}
          intent={initialCounterValid ? "default" : "danger"}
          fill
        />
      </FormGroup>
    </div>
  );
};

PseudonymizationMechanism.propTypes = {
  mechanismConfig: PropTypes.objectOf(PropTypes.any).isRequired,
  updateMechanismConfig: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
};

export default PseudonymizationMechanism;