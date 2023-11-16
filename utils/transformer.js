module.exports = function transformData(yamlString) {
  // Replace apiVersion
  yamlString = yamlString.replace(
    /^apiVersion: "kubernetes-client.io\/v1"/m,
    'apiVersion: "external-secrets.io/v1beta1"'
  );

  // Check if labels are present under spec
  const hasLabels = /labels:\n\s+{{- include "api.labels" . \| nindent 8 }}/.test(yamlString);

  // Remove the existing template section and backendType under spec
  yamlString = yamlString.replace(
    /  template:\n    metadata:\n      labels:\n        {{- include "api.labels" . \| nindent 8 }}\n/,
    ''
  );
  yamlString = yamlString.replace(
    /  backendType: secretsManager\n/,
    ''
  );

  // Start building the new spec section
  let newSpecSection = `spec:\n  refreshInterval: 30s\n  secretStoreRef:\n    name: aws\n    kind: ClusterSecretStore\n`;

  // Conditionally add the target section if labels are present
  if (hasLabels) {
    newSpecSection += `  target:\n    name: {{ include "api.name" . }}-external-secret\n    template:\n      metadata:\n        labels:\n            {{- include "api.labels" . | nindent 12 }}\n`;
  }

  // Replace the spec section with the new content
  yamlString = yamlString.replace(/spec:.+?data:/gs, `${newSpecSection}  data:`);

  // Transform data entries
  const dataRegex = /- key: ([^\n]+)\n\s+name: (\S+)\n\s+property: (\S+)/g;
  yamlString = yamlString.replace(dataRegex, `- secretKey: $2\n      remoteRef:\n        key: $1\n        property: $3`);

  // Separate regex to remove the entire template section under spec
  yamlString = yamlString.replace(
    /^  template:\n( {4}.*\n)*( {4}.*)?/gm,
    ''
  );

  return yamlString;
}
