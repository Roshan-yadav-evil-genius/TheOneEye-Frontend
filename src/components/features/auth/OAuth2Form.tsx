"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OAuth2FormData, OAuth2FormProps } from "@/types/auth";

export function OAuth2Form({
  initialData = {},
  onSubmit,
  submitButtonText,
  onCancel,
}: OAuth2FormProps) {
  const form = useForm<OAuth2FormData>({
    defaultValues: {
      title: initialData.title || "",
      client_id: initialData.client_id || "",
      secret: initialData.secret || "",
      redirect_url: initialData.redirect_url || "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleFormSubmit = async (data: OAuth2FormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter OAuth2 title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
          className={errors.title ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_id">Client ID *</Label>
        <Input
          id="client_id"
          placeholder="Enter client ID"
          {...register("client_id", {
            required: "Client ID is required",
            minLength: {
              value: 1,
              message: "Client ID is required",
            },
          })}
          className={errors.client_id ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.client_id && (
          <p className="text-sm text-red-500">{errors.client_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="secret">Secret *</Label>
        <Input
          id="secret"
          type="password"
          placeholder="Enter secret"
          {...register("secret", {
            required: "Secret is required",
            minLength: {
              value: 1,
              message: "Secret is required",
            },
          })}
          className={errors.secret ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.secret && (
          <p className="text-sm text-red-500">{errors.secret.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="redirect_url">Redirect URL *</Label>
        <Input
          id="redirect_url"
          type="url"
          placeholder="https://example.com/callback"
          {...register("redirect_url", {
            required: "Redirect URL is required",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Redirect URL must be a valid URL",
            },
          })}
          className={errors.redirect_url ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.redirect_url && (
          <p className="text-sm text-red-500">{errors.redirect_url.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}

