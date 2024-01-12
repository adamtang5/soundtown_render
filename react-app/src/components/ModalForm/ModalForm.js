import ModalFormFooter from './ModalFormFooter';
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

  return !entity || !entities.includes(entity) ? (
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
      <ModalFormFooter
        errors={errors}
        buttonGroupData={buttonGroupData}
      />
    </form>
  );
};

export default ModalForm;
