"use client";

import { FieldLabel, FormShell, TextArea, TextInput, postLead } from "./shared";

export function LeadForm() {
  return (
    <FormShell
      onSubmit={async (values) => {
        await postLead({ ...values, formType: "contact", source: "lead-form-short" });
      }}
    >
      {({ register, errors }) => (
        <>
          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
          <div>
            <FieldLabel htmlFor="lead-name">Name</FieldLabel>
            <TextInput id="lead-name" error={errors.name?.message} {...register("name")} />
          </div>
          <div>
            <FieldLabel htmlFor="lead-email">Email</FieldLabel>
            <TextInput id="lead-email" type="email" error={errors.email?.message} {...register("email")} />
          </div>
          <div>
            <FieldLabel htmlFor="lead-message">What are you looking to improve?</FieldLabel>
            <TextArea id="lead-message" rows={4} error={errors.message?.message} {...register("message")} />
          </div>
        </>
      )}
    </FormShell>
  );
}
