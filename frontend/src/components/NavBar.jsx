import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "./NavBar.sass";
import {
  Button,
  NavbarGroup,
  Alignment,
  NavbarHeading,
  Classes,
} from "@blueprintjs/core";
import PolyglotContext from "../js/polyglotContext";
import { ReactComponent as LogoSvg } from "../logo.svg";
import RecognizerConfigDialog from "./RecognizerConfigDialog";

const NavBar = ({
  availableRecognizers,
  activatedRecognizers,
  setActivatedRecognizers,
}) => {
  const t = useContext(PolyglotContext);

  const [showRecognizerConfig, setShowRecognizerConfig] = useState(false);

  return (
    <div>
      <nav className={`${Classes.NAVBAR} ${Classes.DARK}`}>
        <NavbarGroup align={Alignment.LEFT}>
          <LogoSvg className="logo" />
          <NavbarHeading>
            OPEN<b>REDACT</b>
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Button icon="help" title={t("nav.help")} minimal />
          <Button
            icon="cog"
            title={t("nav.settings")}
            minimal
            onClick={() => setShowRecognizerConfig(true)}
          />
        </NavbarGroup>
      </nav>
      <RecognizerConfigDialog
        availableRecognizers={availableRecognizers}
        activatedRecognizers={activatedRecognizers}
        showIdentifierConfig={showRecognizerConfig}
        setShowIdentifierConfig={setShowRecognizerConfig}
        setActivatedRecognizers={setActivatedRecognizers}
      />
    </div>
  );
};

NavBar.propTypes = {
  availableRecognizers: PropTypes.arrayOf(PropTypes.string).isRequired,
  activatedRecognizers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActivatedRecognizers: PropTypes.func.isRequired,
};

export default NavBar;
