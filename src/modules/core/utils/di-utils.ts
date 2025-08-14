import { Container } from "inversify";
import container from "../di/container";

export const getDi = () => container;

export const getService: Container["get"] = (serviceIdentifier) =>
  container.get(serviceIdentifier);
