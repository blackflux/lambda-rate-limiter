module.exports = {

  create(context) {
    const sourceCode = context.getSourceCode();

    const testComment = (node) => {
      if (node.value.startsWith(" istanbul ignore ")) {
        context.report({ node, message: "Not allowed to ignore coverage in this file." });
      }
    };

    return {
      Program() {
        sourceCode.getAllComments().filter(token => token.type !== "Shebang").forEach(testComment);
      }
    };
  }
};
