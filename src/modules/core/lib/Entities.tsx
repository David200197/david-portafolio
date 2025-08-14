import { Fragment, ReactNode } from "react";
import { Collection } from "./Collection";

interface Entity<ID> {
  id: ID;
}

export class Entities<T extends Entity<string>> {
  protected collection: Collection<T>;

  constructor(items: T[]) {
    this.collection = new Collection(...items);
  }

  render(component: (data: T) => ReactNode) {
    return this.collection.map((data) => (
      <Fragment key={data.id}>{component(data)}</Fragment>
    ));
  }
}
