import SimpleButton from "../Buttons/SimpleButton";

const ModalFormFooter = ({
  errors,
  buttonGroupData,
  xPadding,
}) => {
  return (
    <footer
      className="full-width"
      style={xPadding !== undefined ? {
        paddingLeft: `${xPadding}px`,
        paddingRight: `${xPadding}px`,
      } : {}}
    >
      <div className="error-block">
        {errors?.map((error, idx) => (
          <div className="error-text" key={idx}>
            {error}
          </div>
        ))}
      </div>
      <div className="form-action flex-row">
        <div className="legend-required">Required fields</div>
        <div className="form-action-buttons flex-row-rev">
          {buttonGroupData.map(data => (
            <SimpleButton
              key={data.type}
              label={data.label}
              onClick={data.onClick}
              type={data.type}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default ModalFormFooter;
