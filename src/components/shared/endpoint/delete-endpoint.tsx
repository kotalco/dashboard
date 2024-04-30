import { AlertModal } from "@/components/modals/alert-modal";
import { DeleteWithInputForm } from "@/components/delete-form-with-Input";

export interface DeleteEndpointProps {
  name: string;
  url: string;
  redirectUrl: string;
}

export const DeleteEndpoint: React.FC<DeleteEndpointProps> = ({
  name,
  url,
  redirectUrl,
}) => {
  return (
    <div className="mt-5 flex justify-end">
      <AlertModal triggerText="Delete Endpoint" title="Delete Endpoint">
        <DeleteWithInputForm name={name} url={url} redirectUrl={redirectUrl} />
      </AlertModal>
    </div>
  );
};
