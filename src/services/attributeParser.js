function getPreview(langInfo, attributes) {
  for (let i = 0; i < langInfo.groups.length; i++) {
    let currentGroup = langInfo.groups[i];
    for (let j = 0; j < currentGroup.tags.length; j++) {
      let currentSegment = currentGroup.tags[j];
      if (currentSegment.preview && attributes.includes(currentSegment.id)) {
        return currentSegment.preview;
      }
    }
  }
  return undefined;
}

function getTagTitle(langInfo, attribute, lang) {
  for (let i = 0; i < langInfo.groups.length; i++) {
    let currentGroup = langInfo.groups[i];
    for (let j = 0; j < currentGroup.tags.length; j++) {
      let currentSegment = currentGroup.tags[j];
      if (currentSegment.id == attribute) {
        return currentSegment.title[lang];
      }
    }
  }
  return undefined;
}

function getTypeMeta(type) {
  let written;
  let color;
  if (type == "V") {
    written = "Verb";
    color = "verb";
  }
  if (type == "ADJ") {
    written = "Adjective";
    color = "adjective";
  }
  if (type == "N") {
    written = "Noun";
    color = "noun";
  }
  return { written, color };
}

export { getPreview, getTagTitle, getTypeMeta };
