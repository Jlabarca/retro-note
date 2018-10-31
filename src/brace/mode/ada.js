ace.define('ace/mode/ada_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const AdaHighlightRules = function () {
    const keywords = 'abort|else|new|return|abs|elsif|not|reverse|abstract|end|null|accept|entry|select|' +
'access|exception|of|separate|aliased|exit|or|some|all|others|subtype|and|for|out|synchronized|' +
'array|function|overriding|at|tagged|generic|package|task|begin|goto|pragma|terminate|' +
'body|private|then|if|procedure|type|case|in|protected|constant|interface|until|' +
'|is|raise|use|declare|range|delay|limited|record|when|delta|loop|rem|while|digits|renames|with|do|mod|requeue|xor';

    const builtinConstants = (
      'true|false|null'
    );

    const builtinFunctions = (
      'count|min|max|avg|sum|rank|now|coalesce|main'
    );

    const keywordMapper = this.createKeywordMapper({
      'support.function': builtinFunctions,
      keyword: keywords,
      'constant.language': builtinConstants,
    }, 'identifier', true);

    this.$rules = {
      start: [{
        token: 'comment',
        regex: '--.*$',
      }, {
        token: 'string', // " string
        regex: '".*?"',
      }, {
        token: 'string', // ' string
        regex: "'.*?'",
      }, {
        token: 'constant.numeric', // float
        regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b',
      }, {
        token: keywordMapper,
        regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b',
      }, {
        token: 'keyword.operator',
        regex: '\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=',
      }, {
        token: 'paren.lparen',
        regex: '[\\(]',
      }, {
        token: 'paren.rparen',
        regex: '[\\)]',
      }, {
        token: 'text',
        regex: '\\s+',
      }],
    };
  };

  oop.inherits(AdaHighlightRules, TextHighlightRules);

  exports.AdaHighlightRules = AdaHighlightRules;
});

ace.define('ace/mode/ada', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/ada_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const AdaHighlightRules = acequire('./ada_highlight_rules').AdaHighlightRules;

  const Mode = function () {
    this.HighlightRules = AdaHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.lineCommentStart = '--';

    this.$id = 'ace/mode/ada';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
