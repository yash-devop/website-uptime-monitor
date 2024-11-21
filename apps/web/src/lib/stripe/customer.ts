import Stripe from "stripe";
import { StripeInstance } from "./index";

export const createStripeCustomer = async ({
  customerName,
  customerEmail,
  metaData,
}: {
  customerName: string;
  customerEmail: string;
  metaData?: {
    teamId: string;
  };
}) => {
  return await StripeInstance.customers.create({
    name: customerName,
    email: customerEmail,
    metadata: metaData,
  });
};

export const getStripeCustomer = async ({
  customerId,
}: {
  customerId: string;
}) => {
  return await StripeInstance.customers.retrieve(customerId);
};

export const getAllStripeCustomers = async () => {
  const data = await StripeInstance.customers.list({
    limit: 99,
  });
  return data;
};

export const deleteStripeCustomer = async ({
  customerId,
}: {
  customerId: string;
}) => {
  return await StripeInstance.customers.del(customerId);
};
