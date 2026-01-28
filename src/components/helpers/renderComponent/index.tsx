import { RenderComponentProps } from "./interfaces";

export default function RenderComponent({
  if: ifCondition,
  then: thenRender,
  else: elseRender = null,
}: RenderComponentProps) {
  return ifCondition ? thenRender : elseRender;
}
