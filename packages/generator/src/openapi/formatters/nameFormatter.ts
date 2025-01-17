import { camelCase } from "lodash";
import { pascalCase } from "../../helpers";
import type NamedObject from "../models/namedObject";
import ObjectEntity from "../models/objectEntity";
import type TypeReference from "../models/typeReference";

export default class NameFormatter {
  formatNames(item: TypeReference) {
    if (item.type instanceof ObjectEntity) {
      this.formatEntity(item.type);
    } else if (item.type && typeof item.type !== "string") {
      fixName(pascalCase, item.type);
    }
  }

  formatEntity(entity: ObjectEntity) {
    fixName(pascalCase, entity);

    for (const property of entity.properties) {
      fixName(camelCase, property);
    }
  }

  static toPascalCase(item: NamedObject) {
    fixName(pascalCase, item);
  }

  static toCamelCase(item: NamedObject) {
    fixName(camelCase, item);
  }
}

function fixName(projection: (name: string) => string, item: NamedObject) {
  const fixedName = projection(item.name);
  if (fixedName !== item.name) {
    item.externalName = item.name;
    item.name = fixedName;
  }
}
