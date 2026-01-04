// (C) 2021 GoodData Corporation
import React from "react";

export interface IHintProps {
  hint?: string;
}

const Hint: React.FC<IHintProps> = (props) => {
  const { hint } = props;

  return (
    <>
      <div>
        <span aria-label="Look!" role="img">
          👉
        </span>{" "}
        {hint}
      </div>
      <p>
        Powered by{" "}
        <a
          href="https://www.gooddata.com/docs/gooddata-ui/latest/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GoodData.UI
        </a>{" "}
        |{" "}
        <a
          href="https://github.com/gooddata/gooddata-ui-sdk/tree/master/examples/sdk-interactive-examples#gooddataui-sdk---interactive-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          More Examples
        </a>
      </p>
    </>
  );
};

export default Hint;
