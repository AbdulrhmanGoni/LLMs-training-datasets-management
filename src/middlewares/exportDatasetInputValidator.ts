import ErrorResponse from "../utilities/ErrorResponse";
import type { Dataset } from "../types/datasets";
import type { Req } from "../types/request";
import type { ValidationError } from "../types/validation";
import validationSchema from "../validation/validationSchema";
import RequiredObjectIdRule from "../validation/RequiredObjectIdRule";
import { DatasetsFormats } from "../services/export/datasetsFormatsRegistry";
import stringValidator from "../validation/stringValidator";
import type { DatasetsFormatsTypes } from "../types/datasets";

const exportDatasetInputSchema = validationSchema<{
  datasetId: Dataset["id"];
  format: DatasetsFormatsTypes;
}>({
  datasetId: RequiredObjectIdRule(),
  format: stringValidator().required().enum(DatasetsFormats),
});

export default function exportDatasetInputValidator(request: Req) {
  try {
    exportDatasetInputSchema.validate({
      datasetId: request.params.datasetId,
      format: request.search.format,
    });
  } catch (e: any) {
    const validationErrors = e.errors as ValidationError["errors"];
    return ErrorResponse({ validationErrors }, 403);
  }
}
