import SimpleButton from '../Buttons/SimpleButton';
import './ModalForm.css';

const ModalForm = ({
  entity,
  handleSubmit,
  h2,
  formLeft,
  formRight,
  errors,
  buttonGroupData,
}) => {
  const entities = ['song', 'user', 'playlist'];

  return (!entity || !entities.includes(entity)) ? (
    <p>Invalid Entity</p>
  ) : (
    <form
      onSubmit={handleSubmit}
      className={`modal-${entity}-form modal-form`}
    >
      <h2>{h2}</h2>
      <fieldset className={`${entity}-form-container flex-row`}>
        <div className={`${entity}-form-left flex-column`}>
          {formLeft}
        </div>
        <div className={`${entity}-form-right flex-column`}>
          {formRight}
        </div>
      </fieldset>
      <footer>
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
    </form>
  );
};

export default ModalForm;
