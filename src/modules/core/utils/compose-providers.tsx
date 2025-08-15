import { FC, Fragment, PropsWithChildren, ReactNode } from "react";

type Provider = FC<any>;
type PropsWithoutChildren<P> = Omit<P, "children">;

const reduceProvider = (Prev: Provider, Current: Provider) => {
  const ProviderComponent = ({ children }: PropsWithChildren) => (
    <Prev>
      <Current>{children}</Current>
    </Prev>
  );
  return ProviderComponent;
};

export function composeProviders(providers: Provider[]) {
  return ({ children }: { children: ReactNode }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
}

export const createProvider = <T extends object = {}>(
  ProviderComponent: (props: T) => ReactNode,
  props: PropsWithoutChildren<T>
) => {
  const CustomProvider = ({ children }: PropsWithChildren) => (
    <ProviderComponent {...(props as T)}>{children}</ProviderComponent>
  );

  return CustomProvider;
};
