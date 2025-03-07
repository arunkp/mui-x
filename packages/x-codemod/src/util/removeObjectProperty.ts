import type { Collection, JSCodeshift } from 'jscodeshift';

interface RemoveObjectPropertyArgs {
  root: Collection<any>;
  componentsNames: string[];
  /**
   * Prop which contains the object whose property will be removed
   * @example "experimentalFeatures"
   */
  propName: string;
  /**
   * `key` of the property that needs to be removed
   * To remove `newEditingApi` from:
   * <DataGrid experimentalFeatures={{ newEditingApi: true }} />
   * pass "newEditingApi"
   */
  propKey: string;
  j: JSCodeshift;
}

export default function removeObjectProperty({
  root,
  propName,
  componentsNames,
  propKey,
  j,
}: RemoveObjectPropertyArgs) {
  root
    .find(j.JSXElement)
    .filter((path) => {
      return componentsNames.includes((path.value.openingElement.name as any).name);
    })
    .forEach((element) => {
      const targetAttribute = (element.value.openingElement.attributes as any).find(
        (attribute) => attribute.name.name === propName,
      );
      if (!targetAttribute) {
        return;
      }
      const definedKeys: any[] = [];
      const objectProperties = j(targetAttribute).find(j.Property);
      objectProperties.forEach((path) => {
        const objectKey = (path.value.key as any).name as any;
        definedKeys.push(objectKey);
      });
      if (definedKeys.length === 1 && definedKeys[0] === propKey) {
        // only that property is defined, remove the whole prop
        j(element)
          .find(j.JSXAttribute)
          .filter((a) => a.value.name.name === propName)
          .forEach((path) => {
            j(path).remove();
          });
      } else {
        objectProperties.forEach((path) => {
          if ((path.value.key as any).name === propKey) {
            j(path).remove();
          }
        });
      }
    });
}
