ace.define('ace/mode/sh_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextHighlightRules = acequire('./text_highlight_rules').TextHighlightRules;

  const reservedKeywords = exports.reservedKeywords = (
    '!|{|}|case|do|done|elif|else|' +
        'esac|fi|for|if|in|then|until|while|' +
        '&|;|export|local|read|typeset|unset|' +
        'elif|select|set|function|declare|readonly'
  );

  const languageConstructs = exports.languageConstructs = (
    '[|]|alias|bg|bind|break|builtin|' +
     'cd|command|compgen|complete|continue|' +
     'dirs|disown|echo|enable|eval|exec|' +
     'exit|fc|fg|getopts|hash|help|history|' +
     'jobs|kill|let|logout|popd|printf|pushd|' +
     'pwd|return|set|shift|shopt|source|' +
     'suspend|test|times|trap|type|ulimit|' +
     'umask|unalias|wait'
  );

  const ShHighlightRules = function () {
    const keywordMapper = this.createKeywordMapper({
      keyword: reservedKeywords,
      'support.function.builtin': languageConstructs,
      'invalid.deprecated': 'debugger',
    }, 'identifier');

    const integer = '(?:(?:[1-9]\\d*)|(?:0))';

    const fraction = '(?:\\.\\d+)';
    const intPart = '(?:\\d+)';
    const pointFloat = `(?:(?:${intPart}?${fraction})|(?:${intPart}\\.))`;
    const exponentFloat = `(?:(?:${pointFloat}|${intPart})` + ')';
    const floatNumber = `(?:${exponentFloat}|${pointFloat})`;
    const fileDescriptor = `(?:&${intPart})`;

    const variableName = '[a-zA-Z_][a-zA-Z0-9_]*';
    const variable = `(?:${variableName}(?==))`;

    const builtinVariable = '(?:\\$(?:SHLVL|\\$|\\!|\\?))';

    const func = `(?:${variableName}\\s*\\(\\))`;

    this.$rules = {
      start: [{
        token: 'constant',
        regex: /\\./,
      }, {
        token: ['text', 'comment'],
        regex: /(^|\s)(#.*)$/,
      }, {
        token: 'string.start',
        regex: '"',
        push: [{
          token: 'constant.language.escape',
          regex: /\\(?:[$`"\\]|$)/,
        }, {
          include: 'variables',
        }, {
          token: 'keyword.operator',
          regex: /`/, // TODO highlight `
        }, {
          token: 'string.end',
          regex: '"',
          next: 'pop',
        }, {
          defaultToken: 'string',
        }],
      }, {
        token: 'string',
        regex: "\\$'",
        push: [{
          token: 'constant.language.escape',
          regex: /\\(?:[abeEfnrtv\\'"]|x[a-fA-F\d]{1,2}|u[a-fA-F\d]{4}([a-fA-F\d]{4})?|c.|\d{1,3})/,
        }, {
          token: 'string',
          regex: "'",
          next: 'pop',
        }, {
          defaultToken: 'string',
        }],
      }, {
        regex: '<<<',
        token: 'keyword.operator',
      }, {
        stateName: 'heredoc',
        regex: "(<<-?)(\\s*)(['\"`]?)([\\w\\-]+)(['\"`]?)",
        onMatch(value, currentState, stack) {
          const next = value[2] == '-' ? 'indentedHeredoc' : 'heredoc';
          const tokens = value.split(this.splitRegex);
          stack.push(next, tokens[4]);
          return [
            { type: 'constant', value: tokens[1] },
            { type: 'text', value: tokens[2] },
            { type: 'string', value: tokens[3] },
            { type: 'support.class', value: tokens[4] },
            { type: 'string', value: tokens[5] },
          ];
        },
        rules: {
          heredoc: [{
            onMatch(value, currentState, stack) {
              if (value === stack[1]) {
                stack.shift();
                stack.shift();
                this.next = stack[0] || 'start';
                return 'support.class';
              }
              this.next = '';
              return 'string';
            },
            regex: '.*$',
            next: 'start',
          }],
          indentedHeredoc: [{
            token: 'string',
            regex: '^\t+',
          }, {
            onMatch(value, currentState, stack) {
              if (value === stack[1]) {
                stack.shift();
                stack.shift();
                this.next = stack[0] || 'start';
                return 'support.class';
              }
              this.next = '';
              return 'string';
            },
            regex: '.*$',
            next: 'start',
          }],
        },
      }, {
        regex: '$',
        token: 'empty',
        next(currentState, stack) {
          if (stack[0] === 'heredoc' || stack[0] === 'indentedHeredoc') { return stack[0]; }
          return currentState;
        },
      }, {
        token: ['keyword', 'text', 'text', 'text', 'variable'],
        regex: /(declare|local|readonly)(\s+)(?:(-[fixar]+)(\s+))?([a-zA-Z_][a-zA-Z0-9_]*\b)/,
      }, {
        token: 'variable.language',
        regex: builtinVariable,
      }, {
        token: 'variable',
        regex: variable,
      }, {
        include: 'variables',
      }, {
        token: 'support.function',
        regex: func,
      }, {
        token: 'support.function',
        regex: fileDescriptor,
      }, {
        token: 'string', // ' string
        start: "'",
        end: "'",
      }, {
        token: 'constant.numeric', // float
        regex: floatNumber,
      }, {
        token: 'constant.numeric', // integer
        regex: `${integer}\\b`,
      }, {
        token: keywordMapper,
        regex: '[a-zA-Z_][a-zA-Z0-9_]*\\b',
      }, {
        token: 'keyword.operator',
        regex: '\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|~|<|>|<=|=>|=|!=|[%&|`]',
      }, {
        token: 'punctuation.operator',
        regex: ';',
      }, {
        token: 'paren.lparen',
        regex: '[\\[\\(\\{]',
      }, {
        token: 'paren.rparen',
        regex: '[\\]]',
      }, {
        token: 'paren.rparen',
        regex: '[\\)\\}]',
        next: 'pop',
      }],
      variables: [{
        token: 'variable',
        regex: /(\$)(\w+)/,
      }, {
        token: ['variable', 'paren.lparen'],
        regex: /(\$)(\()/,
        push: 'start',
      }, {
        token: ['variable', 'paren.lparen', 'keyword.operator', 'variable', 'keyword.operator'],
        regex: /(\$)(\{)([#!]?)(\w+|[*@#?\-$!0_])(:[?+\-=]?|##?|%%?|,,?\/|\^\^?)?/,
        push: 'start',
      }, {
        token: 'variable',
        regex: /\$[*@#?\-$!0_]/,
      }, {
        token: ['variable', 'paren.lparen'],
        regex: /(\$)(\{)/,
        push: 'start',
      }],
    };

    this.normalizeRules();
  };

  oop.inherits(ShHighlightRules, TextHighlightRules);

  exports.ShHighlightRules = ShHighlightRules;
});

ace.define('ace/mode/folding/cstyle', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], (acequire, exports, module) => {
  const oop = acequire('../../lib/oop');
  const Range = acequire('../../range').Range;
  const BaseFoldMode = acequire('./fold_mode').FoldMode;

  const FoldMode = exports.FoldMode = function (commentRegex) {
    if (commentRegex) {
      this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, `|${commentRegex.start}`));
      this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, `|${commentRegex.end}`));
    }
  };
  oop.inherits(FoldMode, BaseFoldMode);

  (function () {
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function (session, foldStyle, row) {
      const line = session.getLine(row);

      if (this.singleLineBlockCommentRe.test(line)) {
        if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line)) { return ''; }
      }

      const fw = this._getFoldWidgetBase(session, foldStyle, row);

      if (!fw && this.startRegionRe.test(line)) { return 'start'; } // lineCommentRegionStart

      return fw;
    };

    this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
      const line = session.getLine(row);

      if (this.startRegionRe.test(line)) { return this.getCommentRegionBlock(session, line, row); }

      var match = line.match(this.foldingStartMarker);
      if (match) {
        var i = match.index;

        if (match[1]) { return this.openingBracketBlock(session, match[1], row, i); }

        let range = session.getCommentFoldRange(row, i + match[0].length, 1);

        if (range && !range.isMultiLine()) {
          if (forceMultiline) {
            range = this.getSectionRange(session, row);
          } else if (foldStyle != 'all') { range = null; }
        }

        return range;
      }

      if (foldStyle === 'markbegin') { return; }

      var match = line.match(this.foldingStopMarker);
      if (match) {
        var i = match.index + match[0].length;

        if (match[1]) { return this.closingBracketBlock(session, match[1], row, i); }

        return session.getCommentFoldRange(row, i, -1);
      }
    };

    this.getSectionRange = function (session, row) {
      let line = session.getLine(row);
      const startIndent = line.search(/\S/);
      const startRow = row;
      const startColumn = line.length;
      row += 1;
      let endRow = row;
      const maxRow = session.getLength();
      while (++row < maxRow) {
        line = session.getLine(row);
        const indent = line.search(/\S/);
        if (indent === -1) { continue; }
        if (startIndent > indent) { break; }
        const subRange = this.getFoldWidgetRange(session, 'all', row);

        if (subRange) {
          if (subRange.start.row <= startRow) {
            break;
          } else if (subRange.isMultiLine()) {
            row = subRange.end.row;
          } else if (startIndent == indent) {
            break;
          }
        }
        endRow = row;
      }

      return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function (session, line, row) {
      const startColumn = line.search(/\s*$/);
      const maxRow = session.getLength();
      const startRow = row;

      const re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
      let depth = 1;
      while (++row < maxRow) {
        line = session.getLine(row);
        const m = re.exec(line);
        if (!m) continue;
        if (m[1]) depth--;
        else depth++;

        if (!depth) break;
      }

      const endRow = row;
      if (endRow > startRow) {
        return new Range(startRow, startColumn, endRow, line.length);
      }
    };
  }).call(FoldMode.prototype);
});

ace.define('ace/mode/sh', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/sh_highlight_rules', 'ace/range', 'ace/mode/folding/cstyle', 'ace/mode/behaviour/cstyle'], (acequire, exports, module) => {
  const oop = acequire('../lib/oop');
  const TextMode = acequire('./text').Mode;
  const ShHighlightRules = acequire('./sh_highlight_rules').ShHighlightRules;
  const Range = acequire('../range').Range;
  const CStyleFoldMode = acequire('./folding/cstyle').FoldMode;
  const CstyleBehaviour = acequire('./behaviour/cstyle').CstyleBehaviour;

  const Mode = function () {
    this.HighlightRules = ShHighlightRules;
    this.foldingRules = new CStyleFoldMode();
    this.$behaviour = new CstyleBehaviour();
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.lineCommentStart = '#';

    this.getNextLineIndent = function (state, line, tab) {
      let indent = this.$getIndent(line);

      const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
      const tokens = tokenizedLine.tokens;

      if (tokens.length && tokens[tokens.length - 1].type == 'comment') {
        return indent;
      }

      if (state == 'start') {
        const match = line.match(/^.*[\{\(\[:]\s*$/);
        if (match) {
          indent += tab;
        }
      }

      return indent;
    };

    const outdents = {
      pass: 1,
      return: 1,
      raise: 1,
      break: 1,
      continue: 1,
    };

    this.checkOutdent = function (state, line, input) {
      if (input !== '\r\n' && input !== '\r' && input !== '\n') { return false; }

      const tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;

      if (!tokens) { return false; }
      do {
        var last = tokens.pop();
      } while (last && (last.type == 'comment' || (last.type == 'text' && last.value.match(/^\s+$/))));

      if (!last) { return false; }

      return (last.type == 'keyword' && outdents[last.value]);
    };

    this.autoOutdent = function (state, doc, row) {
      row += 1;
      const indent = this.$getIndent(doc.getLine(row));
      const tab = doc.getTabString();
      if (indent.slice(-tab.length) == tab) { doc.remove(new Range(row, indent.length - tab.length, row, indent.length)); }
    };

    this.$id = 'ace/mode/sh';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
