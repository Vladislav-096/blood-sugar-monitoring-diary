import {
  Backdrop,
  Box,
  Fade,
  FormControl,
  FormHelperText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  formHelperErrorStyles,
  modalContentStyles,
  modalInnerContentStyles,
  textFieldStyle,
  validationRules,
} from "../../constants/constants";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  FieldPath,
  RegisterOptions,
} from "react-hook-form";
import {
  CheckoutState,
  FormTypesCreateMeasurement,
  FormTypesEditMeasurement,
} from "../../types/types";
import { CustomRequestErrorAlert } from "../CustomRequestErrorAlert/CustomRequestErrorAlert";
import { SubmitModalButton } from "../SubmitModalButton/SubmitModalButton";
import { ReactNode } from "react";

interface MeasurementModal<
  T extends FormTypesCreateMeasurement | FormTypesEditMeasurement
> {
  open: boolean;
  onClose: () => void;
  title: string;
  handleSubmit: UseFormHandleSubmit<T, undefined>;
  onSubmit: (formData: T) => void;
  errors: FieldErrors<T>;
  control: Control<T>; // ?
  handleMeasurementChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  measurement: string;
  alertMeasurementError: string;
  isAlert: boolean;
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>>;
  measurementStatus: CheckoutState;
  isAnyLoading: boolean;
  children: ReactNode;
}

const measurementAndPortionMaxLength = 5;

export const MeasurementModal = <
  T extends FormTypesCreateMeasurement | FormTypesEditMeasurement
>({
  open,
  onClose,
  title,
  handleSubmit,
  onSubmit,
  errors,
  control,
  handleMeasurementChange,
  measurement,
  alertMeasurementError,
  isAlert,
  setIsAlert,
  measurementStatus,
  isAnyLoading,
  children,
}: MeasurementModal<T>) => {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 200,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalContentStyles}>
            <Box sx={modalInnerContentStyles}>
              <Typography
                component="h2"
                sx={{ marginBottom: "10px", fontSize: "20px" }}
              >
                {title}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                {children}
                <FormControl
                  error={errors.measurement ? true : false}
                  fullWidth
                >
                  <Controller
                    name={"measurement" as FieldPath<T>}
                    control={control}
                    rules={
                      validationRules.measurement as RegisterOptions<
                        T,
                        FieldPath<T>
                      >
                    }
                    render={() => (
                      <TextField
                        value={measurement}
                        onChange={handleMeasurementChange}
                        label="Measurement"
                        variant="outlined"
                        error={errors.measurement ? true : false}
                        sx={textFieldStyle}
                        slotProps={{
                          input: {
                            inputProps: {
                              maxLength: measurementAndPortionMaxLength,
                            },
                          },
                        }}
                      />
                    )}
                  />
                  {errors.measurement && (
                    <FormHelperText sx={formHelperErrorStyles}>
                      {errors.measurement?.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
                <SubmitModalButton
                  requestStatus={measurementStatus}
                  buttonName={"submit"}
                  isDisbled={isAnyLoading}
                />
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <CustomRequestErrorAlert
        title={alertMeasurementError}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        status={measurementStatus}
      />
    </>
  );
};
