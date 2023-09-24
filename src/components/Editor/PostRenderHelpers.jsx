export const MAX_INDENT = 8

export default function PostRenderHelpers() {
  let indents = '';

  for (let i = 1; i <= MAX_INDENT; i++) {
    indents += ` .ql-indent-${i} { margin-left: ${i * 30}px; }`;
  }

  return (
    <style>
      {indents}
      {`
        .ql-align-center {
          text-align: center;
        }
        .ql-align-right {
          text-align: right;
        }
      `}
    </style>
  )
}
