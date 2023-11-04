import { Component } from 'react';
import cn from 'classnames';
import { withStore, createStore } from 'justorm/react';

import { NODE_TYPES } from 'types/node';

import { Button, Form, Icon, LightBox, SubmitButtons } from '@homecode/ui';

import Editor from 'components/Editor/Editor';
import NodeTypeSelector from 'components/NodeTypeSelector/NodeTypeSelector';
import { NodesSelector } from 'components/NodesSelector/NodesSelector';

import S from './NodeForm.styl';
import RunForm from './RunForm/RunForm';

const validationSchema = {
  name: { type: 'string', empty: false },
  type: { type: 'string', empty: false },
  data: { type: 'string', empty: false },
  outputNodeIds: { type: 'array', items: 'number' },
};

type Props = {
  id: string;
  className?: string;
  store?: { nodes: any; runs: any };
};

function tagsToIds(prompt: string) {
  return prompt
    .replace(/<span[^>]+data-props="({[^}]+})"[^>]*><\/span>/g, (_, props) => {
      const { nodeId } = JSON.parse(props.replace(/&quot;/g, '"'));
      return `[${nodeId}]`;
    })
    .replace(/&nbsp;/g, '');
}

function idsToTags(prompt: string) {
  return prompt.replace(/\[(\d+)\]/g, (_, nodeId) => {
    const props = JSON.stringify({ nodeId, component: 'Tag' }).replace(
      /"/g,
      '&quot;'
    );
    return `<span data-props="${props}"></span>`;
  });
}

@withStore({
  nodes: ['byId', 'selectedId'],
  runs: ['byNodeId'],
})
export default class NodeForm extends Component<Props> {
  store: any;
  form: any;

  constructor(props) {
    super(props);

    const { name, type, data, outputNodeIds } = this.data;

    this.store = createStore(this, {
      currType: type,
      initialValues: {
        name,
        type,
        data: idsToTags(data),
        outputNodeIds: [...outputNodeIds],
      },
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  get nodes() {
    return this.props.store.nodes;
  }

  get runs() {
    return this.props.store.runs;
  }

  get data() {
    const { id } = this.props;
    const { byId } = this.nodes;

    return byId[id] ?? {};
  }

  onClick = e => {
    // set edit mode on double click
    if (e.detail === 2) {
      this.nodes.setSelected(this.props.id);
    }
  };

  onTypeChange = val => {
    this.form.setValue('type', val);
  };

  onSave = async () => {
    const dto = {
      ...this.form.values,
      data: tagsToIds(this.form.values.data),
    };

    const { name, type, data, outputNodeIds } = await this.nodes.updateNode(
      this.props.id,
      dto
    );

    Object.assign(this.store.initialValues, {
      name,
      type,
      data: idsToTags(data),
      outputNodeIds,
    });

    this.nodes.setSelected(null);
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    // ESC
    if (e.key === 'Escape') {
      this.nodes.setSelected(null);
    }

    // Ctrl + S
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      this.onSave();
    }
  };

  renderDataField = ({ Field }) => {
    const props = {
      hideRequiredStar: true,
      name: 'data',
      variant: 'clean',
      className: S.data,
      controlProps: { style: { minHeight: 100 } },
    };

    switch (this.store.currType) {
      case NODE_TYPES.Function:
        return (
          <Field
            name="data"
            {...props}
            component={Editor}
            showToolbar={false}
          />
        );
      default:
        return <Field name="data" {...props} type="textarea" />;
    }
  };

  renderFooter() {
    const { Field, isValid, isDirty, isLoading, values } = this.form;
    const { outputNodeIds, type } = values;
    const isFunction = type === NODE_TYPES.Function;

    if (!isFunction && !isDirty) return;

    return (
      <div className={S.footer}>
        {isFunction ? (
          <Field
            name="outputNodeIds"
            component={NodesSelector}
            size="s"
            label={outputNodeIds[0] ? 'Output node' : 'Select output node'}
            className={S.outputButton}
            variant="clear"
            // onChange={val =>
            //   this.form.setValue(
            //     'outputNodeIds',
            //     Array.from(new Set([...outputNodeIds, val]))
            //   )
            // }
          />
        ) : (
          <div />
        )}

        {isDirty && (
          <SubmitButtons
            className={S.submitButtons}
            buttons={[
              {
                key: 'submit',
                children: 'Save',
                variant: 'primary',
                type: 'submit',
                size: 's',
                disabled: !isValid || !isDirty,
                loading: isLoading,
              },
            ]}
          />
        )}

        {isFunction && <RunForm />}
      </div>
    );
  }

  renderFields = form => {
    const { Field, isDirty } = form;

    this.form = form;

    return (
      <>
        <div className={cn(S.header, isDirty && S.changed)}>
          <Field
            name="type"
            size="m"
            label="Type"
            clearMargins
            component={NodeTypeSelector}
            onChange={this.onTypeChange}
          />
          <Field
            name="name"
            size="s"
            clearMargins
            hideRequiredStar
            variant="clean"
            className={S.name}
          />

          <Button size="s" square variant="clear" className={S.link}>
            <Icon type="link" />
          </Button>

          {/* &nbsp; &nbsp;
          <Field
            name="repeatCount"
            size="s"
            className={S.repeat}
            clearMargins
            hideRequiredStar
            label="N to repeat"
            component={Input}
            type="number"
            min={1}
          /> */}

          {/* TODO: calendar, cron job */}
          {/* <Button
            variant="clear"
            onClick={() => setRepeatOpen(true)}
            className={S.repeatButton}
          >
            <Icon type="repeat" />
          </Button> */}
        </div>

        {this.renderDataField({ Field })}

        {this.renderFooter()}
      </>
    );
  };

  renderForm = (cls?) => {
    return (
      <Form
        initialValues={{ ...this.store.initialValues.originalObject }}
        validationSchema={validationSchema}
        className={cls}
        onSubmit={this.onSave}
      >
        {form => this.renderFields(form)}
      </Form>
    );
  };

  render() {
    const { id, className } = this.props;
    const type = this.form?.values.type ?? this.data.type;
    const classes = cn(
      S.root,
      type && S[`type-${type.toLowerCase()}`],
      className
    );

    return (
      <div className={cn(classes, S.preview)} onClick={this.onClick}>
        <div className={S.id}>{id}</div>
        {this.renderForm()}
      </div>
    );

    // TODO: settings.openEditorInFullscreen
    return (
      <LightBox
        className={S.editor}
        isOpen
        blur
        onClose={() => this.nodes.setSelected(null)}
      >
        {this.renderForm(classes)}
      </LightBox>
    );
  }
}
