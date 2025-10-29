import { apiClient } from "./client";

export interface PromoValidationRequest {
  promoCode: string;
  totalAmount: number;
}

export interface PromoValidationResponse {
  success: boolean;
  promo?: {
    code: string;
    description: string;
    type: "percentage" | "fixed";
    value: number;
  };
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  message: string;
}

export const promoService = {
  async validatePromo(
    data: PromoValidationRequest
  ): Promise<PromoValidationResponse> {
    const response = await apiClient.post("/promo/validate", data);
    return response;
  },
};
