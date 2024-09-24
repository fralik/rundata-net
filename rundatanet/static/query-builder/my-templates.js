/* QueryBuilder templates without wrapping add/delete buttons into Bootstrap's button group
   Changes: remove btn-group for add_rule/group, make buttons btn-xs
 * Use it during builder initialization as:
    {
      templates: {
        group: gQueryBuilderCustomGroup,
      }
  }
 */
const gQueryBuilderCustomGroup = ({ group_id, level, conditions, icons, settings, translate, builder }) => {
  return `
    <div id="${group_id}" class="rules-group-container">
      <div class="rules-group-header">
        <div class="pull-right group-actions">
          <button type="button" class="btn btn-xs btn-info" data-add="rule">
            <i class="${icons.add_rule}"></i> ${translate("add_rule")}
          </button>
          ${settings.allow_groups === -1 || settings.allow_groups >= level ? `
            <button type="button" class="btn btn-xs btn-info" data-add="group">
              <i class="${icons.add_group}"></i> ${translate("add_group")}
            </button>
          ` : ''}
          ${level > 1 ? `
            <button type="button" class="btn btn-xs btn-danger" data-delete="group">
              <i class="${icons.remove_group}"></i> ${translate("delete_group")}
            </button>
          ` : ''}
        </div>
        <div class="btn-group group-conditions">
          ${conditions.map(condition => `
            <label class="btn btn-xs btn-primary">
              <input type="radio" name="${group_id}_cond" value="${condition}"> ${translate("conditions", condition)}
            </label>
          `).join('\n')}
        </div>
        ${settings.display_errors ? `
          <div class="error-container"><i class="${icons.error}"></i></div>
        ` : ''}
      </div>
      <div class=rules-group-body>
        <div class=rules-list></div>
      </div>
    </div>`;
};
