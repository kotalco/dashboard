import { AlertModal } from "@/components/modals/alert-modal";
import { DeleteWithInputForm } from "@/components/delete-form-with-Input";

export interface DeleteEndpointProps {
  name: string;
}

export const DeleteEndpoint: React.FC<DeleteEndpointProps> = ({ name }) => {
  return (
    <div className="mt-5 flex justify-end">
      <AlertModal triggerText="Delete Endpoint" title="Delete Endpoint">
        <DeleteWithInputForm
          name={name}
          url={`/virtual-endpoints/${name}`}
          redirectUrl={`/virtual-endpoints`}
        />
      </AlertModal>
    </div>
  );
};
