ace.define('ace/mode/properties_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const PropertiesHighlightRules = function () {
    const escapeRe = /\\u[0-9a-fA-F]{4}|\\/;

    this.$rules = {
      start: [
        {
          token: 'comment',
          regex: /[!#].*$/,
        }, {
          token: 'keyword',
          regex: /[=:]$/,
        }, {
          token: 'keyword',
          regex: /[=:]/,
          next: 'value',
        }, {
          token: 'constant.language.escape',
          regex: escapeRe,
        }, {
          defaultToken: 'variable',
        },
      ],
      value: [
        {
          regex: /\\$/,
          token: 'string',
          next: 'value',
        }, {
          regex: /$/,
          token: 'string',
          next: 'start',
        }, {
          token: 'constant.language.escape',
          regex: escapeRe,
        }, {
          defaultToken: 'string',
        },
      ],
    };
  };

  oop.inherits(PropertiesHighlightRules, TextHighlightRules);

  exports.PropertiesHighlightRules = PropertiesHighlightRules;
});

ace.define('ace/mode/properties', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/properties_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const PropertiesHighlightRules = acequire('./properties_highlight_rules').PropertiesHighlightRules;

  const Mode = function () {
    this.HighlightRules = PropertiesHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.$id = 'ace/mode/properties';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
