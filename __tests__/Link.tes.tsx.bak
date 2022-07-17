import renderer from "react-test-renderer";
import React from "react";
import { Link2 } from "../src/testExample/Link";

it("changes the class when hovered", () => {
  const component = renderer.create(
    <Link2 page="http://www.facebook.com">Facebook</Link2>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  renderer.act(() => {
    component.root.findByType("a").props.onMouseEnter();
  });
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  renderer.act(() => {
    component.root.findByType("a").props.onMouseLeave();
  });
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
