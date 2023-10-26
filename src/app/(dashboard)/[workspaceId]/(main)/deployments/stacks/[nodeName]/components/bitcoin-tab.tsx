"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { client } from "@/lib/client-instance";
import { BitcoinNode, StacksNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  bitcoinNode: z.string().transform((value) => {
    const { name, p2pPort, rpcPort, rpcUsers } = JSON.parse(
      value
    ) as BitcoinNode;
    return {
      endpoint: name,
      p2pPort,
      rpcPort,
      rpcUsername: rpcUsers[0].username,
      rpcPasswordSecretName: rpcUsers[0].passwordSecretName,
    };
  }),
});

type Schema = z.input<typeof schema>;

interface BitconTabProps {
  node: StacksNode;
  bitcoinNodes: BitcoinNode[];
  role: Roles;
}

export const BitconTab: React.FC<BitconTabProps> = ({
  node,
  role,
  bitcoinNodes,
}) => {
  const router = useRouter();
  const { bitcoinNode } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      bitcoinNode: JSON.stringify(
        bitcoinNodes.find(({ name }) => bitcoinNode.endpoint === name)
      ),
    },
  });

  const {
    formState: {
      isSubmitted,
      isSubmitting,
      isValid,
      isDirty,
      isSubmitSuccessful,
      errors,
    },
    reset,
    setError,
    setValue,
  } = form;

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<StacksNode>(
        `/stacks/nodes/${node.name}`,
        values
      );
      const { bitcoinNode } = data;
      reset({
        bitcoinNode: JSON.stringify(
          bitcoinNodes.find(({ name }) => bitcoinNode.endpoint === name)
        ),
      });
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-4"
      >
        <FormField
          control={form.control}
          name="bitcoinNode"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Bitcoin Node</FormLabel>
              <Select
                disabled={isSubmitting || role === Roles.Reader}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    data-testid="bitcoin-node"
                    className="bg-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bitcoinNodes
                    .filter(({ rpc }) => rpc)
                    .map((node) => (
                      <SelectItem key={node.name} value={JSON.stringify(node)}>
                        {node.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Bitcoin nodes with JSON-RPC server enabled
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Bitcoin settings have been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {role !== Roles.Reader && (
          <TabsFooter>
            <Button
              disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
              data-testid="submit"
              type="submit"
            >
              Save
            </Button>
          </TabsFooter>
        )}
      </form>
    </Form>
  );
};
