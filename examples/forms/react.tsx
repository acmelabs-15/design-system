import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@acmelabs/design-system-react/components/button";
import { Box } from "@acmelabs/design-system-react/components/box";
import { Field } from "@acmelabs/design-system-react/components/field";
import { Input } from "@acmelabs/design-system-react/components/input";
import { Switch } from "@acmelabs/design-system-react/components/switch";
import { HStack } from "@acmelabs/design-system-react/components/h-stack";
import { VStack } from "@acmelabs/design-system-react/components/v-stack";

export function ManagedFormReact() {
  const [receipt, setReceipt] = useState("");
  const [disabled, setDisabled] = useState(false);
  const nextContact = useRef(2);
  const form = useForm({
    defaultValues: { profile: { name: "" }, contacts: [{ id: "contact-1", email: "" }], updates: true },
    onSubmit: ({ value }) => setReceipt(JSON.stringify(value)),
  });
  return (
    <VStack gap="4" alignItems="stretch" width="360px" maxWidth="100%">
      <Button type="button" variant="secondary" onClick={() => setDisabled(!disabled)}>
        {disabled ? "Enable fields" : "Disable fields"}
      </Button>
      <form
        aria-label="Profile"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        onReset={(event) => {
          event.preventDefault();
          form.reset();
          setReceipt("");
        }}
      >
        <VStack gap="4" alignItems="stretch">
          <form.Field name="profile.name" validators={{ onChange: ({ value }) => (value.trim().length < 2 ? "Use at least two letters." : undefined) }}>
            {(field) => (
              <Field required invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                <span slot="label">Name</span>
                <Input
                  name={field.name}
                  required
                  disabled={disabled}
                  value={field.state.value}
                  invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  onAcmeInput={(event) => field.handleChange(event.detail.value)}
                  onBlur={() => field.handleBlur()}
                />
                <span slot="error">{field.state.meta.errors.join(" ")}</span>
              </Field>
            )}
          </form.Field>
          <form.Field name="contacts" mode="array">
            {(contacts) => (
              <VStack gap="3" alignItems="stretch">
                {contacts.state.value.map((contact, index) => (
                  <HStack key={contact.id} gap="2" alignItems="start">
                    <Box flexGrow={1} flexShrink={1} flexBasis="0%" minWidth="0">
                      <form.Field name={`contacts[${index}].email`} validators={{ onChange: ({ value }) => (/.+@.+\..+/.test(value) ? undefined : "Enter an email address.") }}>
                        {(field) => (
                          <Field required invalid={field.state.meta.isTouched && !field.state.meta.isValid}>
                            <span slot="label">Contact {index + 1}</span>
                            <Input
                              name={field.name}
                              type="email"
                              required
                              disabled={disabled}
                              value={field.state.value}
                              invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                              onAcmeInput={(event) => field.handleChange(event.detail.value)}
                              onBlur={() => field.handleBlur()}
                            />
                            <span slot="error">{field.state.meta.errors.join(" ")}</span>
                          </Field>
                        )}
                      </form.Field>
                    </Box>
                    <Box flexShrink={0}>
                      <Button type="button" variant="secondary" disabled={disabled} aria-label={`Remove contact ${index + 1}`} onClick={() => contacts.removeValue(index)}>
                        Remove
                      </Button>
                    </Box>
                  </HStack>
                ))}
                <Button type="button" variant="secondary" disabled={disabled} onClick={() => contacts.pushValue({ id: `contact-${nextContact.current++}`, email: "" })}>
                  Add contact
                </Button>
              </VStack>
            )}
          </form.Field>
          <form.Field name="updates">
            {(field) => (
              <Switch
                name={field.name}
                aria-label="Product updates"
                disabled={disabled}
                checked={field.state.value}
                onAcmeChange={(event) => field.handleChange(event.detail.checked)}
                onBlur={() => field.handleBlur()}
              />
            )}
          </form.Field>
          <HStack gap="3">
            <Button type="submit" disabled={disabled}>
              Submit profile
            </Button>
            <Button type="reset" variant="secondary">
              Reset form
            </Button>
          </HStack>
          <output aria-live="polite">{receipt}</output>
        </VStack>
      </form>
    </VStack>
  );
}
