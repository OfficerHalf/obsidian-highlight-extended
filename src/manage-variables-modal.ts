import { App } from 'obsidian';
import { ManageModal } from './manage-modal';

export class ManageVariablesModal extends ManageModal {
  variables!: Record<string, string>;

  constructor(
    app: App,
    private readonly addVariable: (key: string, value: string) => Promise<boolean>,
    private readonly removeVariable: (key: string) => Promise<void>
  ) {
    super(app);
  }

  onOpen(): void {
    this.render();
  }

  private render(): void {
    this.modalEl.addClass('text-color-plugin-modal');
    this.titleEl.setText('Manage Color Variables');
    this.contentEl.empty();

    const table = this.contentEl.createEl('table', { cls: 'text-color-table--table' });
    const headerRow = table.createEl('tr', { cls: 'text-color-table--table-header' });
    headerRow.createEl('th', { text: 'Variable' });
    headerRow.createEl('th', { text: 'Value' });
    headerRow.createEl('th');

    // Build rows of existing variables
    if (this.variables && Object.keys(this.variables).length > 0) {
      Object.keys(this.variables).forEach((key) => {
        const row = table.createEl('tr', { cls: 'text-color-table--table-row' });
        row.createEl('td', { text: key });
        const valueCell = row.createEl('td', {
          cls: 'text-color-table--color-value',
          text: this.getTextValue(this.variables[key])
        });
        valueCell.createSpan({
          cls: 'text-color-table--color-square',
          attr: { style: `background-color: ${this.getStyleValue(this.variables[key])};` }
        });
        const deleteCell = row.createEl('td', { cls: 'text-color-table--button-cell' });
        const deleteButton = deleteCell.createEl('button', { text: 'Delete' });
        deleteButton.addEventListener('click', () => {
          this.removeVariable(key);
          delete this.variables[key];
          this.render();
        });
      });
    }

    // Build row of inputs for new variables
    const inputRow = table.createEl('tr', {
      cls: ['text-color-table--table-row', 'text-color-table--input-row']
    });
    const varNameCell = inputRow.createEl('td');
    const varNameInput = varNameCell.createEl('input', { attr: { placeholder: 'Variable', type: 'text' } });

    const varValueCell = inputRow.createEl('td');
    const varValueInput = varValueCell.createEl('input', {
      cls: 'text-color-table--var-value-input',
      attr: { placeholder: 'Value', type: 'text' }
    });

    const addCell = inputRow.createEl('td', { cls: 'text-color-table--button-cell' });
    const addButton = addCell.createEl('button', { cls: 'mod-cta', text: 'Add' });
    addButton.addEventListener('click', async () => {
      if (varNameInput.value && varValueInput.value) {
        const value = this.getColorValue(varValueInput.value);
        if (value) {
          const added = await this.addVariable(varNameInput.value, value);
          if (added) {
            this.variables[varNameInput.value] = value;
            this.render();
          }
        }
      }
    });
  }
}
