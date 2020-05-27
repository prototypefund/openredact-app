import React, { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import AnnotationControl from "./annotation/AnnotationControl";
import PreviewControl from "./preview/PreviewControl";
import "./Main.sass";
import API from "./api";
import Token from "./token";
import Annotation from "./annotation";
import Anonymization from "./anonymization";

const Main = () => {
  const [tokens, setTokens] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [initialAnnotations, setInitialAnnotations] = useState([]);
  const [anonymizations, setAnonymizations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState({});

  const fileFormData = useRef({});

  useEffect(() => {
    // TODO query anonymizer backend with annotations and their tokens
    //  (e.g. {text: "Foo Bar", tag: "Misc"}
    // for now replace every annotation with XXX
    const newAnonymizations = annotations.map((myAnnotation) => {
      return new Anonymization(
        myAnnotation.start,
        myAnnotation.end,
        tokens[myAnnotation.start].startChar,
        tokens[myAnnotation.end - 1].endChar,
        "XXX"
      );
    });

    setAnonymizations(newAnonymizations);
  }, [tokens, annotations]);

  useEffect(() => {
    API.post("nlp/score/", {
      computedAnnotations: initialAnnotations,
      goldAnnotations: annotations,
    }).then((response) => setScores(response.data));
  }, [annotations, initialAnnotations]);

  const onCancel = () => {
    setTokens([]);
    setAnnotations([]);
    setAnonymizations([]);
  };

  const onFileDrop = (files) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);
    fileFormData.current = formData;

    API.post("nlp/find-piis/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setTokens(
          response.data.tokens.map(
            (token) =>
              new Token(
                token.start_char,
                token.end_char,
                token.text,
                token.has_ws
              )
          )
        );

        const myAnnotations = response.data.piis.map((pii) => {
          return new Annotation(pii.start_tok, pii.end_tok, pii.tag);
        });
        setAnnotations(myAnnotations);
        setInitialAnnotations(myAnnotations);

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onDownload = () => {
    const formData = fileFormData.current;
    formData.set("anonymizations", JSON.stringify(anonymizations));
    API.post("file/anonymize/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    })
      .then((response) => {
        const blob = new Blob([response.data]);
        saveAs(blob, formData.get("file").name);
      })
      .catch
      // TODO
      ();
  };

  return (
    <div className="main-view">
      <AnnotationControl
        tokens={tokens}
        scores={scores}
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
        onFileDrop={onFileDrop}
        onCancel={onCancel}
        isLoading={isLoading}
      />
      <PreviewControl
        tokens={tokens}
        anonymizations={anonymizations}
        onDownload={onDownload}
      />
    </div>
  );
};

export default Main;