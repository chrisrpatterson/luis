import * as React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon } from 'semantic-ui-react';
import { style } from 'typestyle';

import { TestView } from './test_view';
import { timing } from './component_styles';
import { TestGroup } from '../models/test_group_model';

const pane = () =>
  style({
    $nest: {
      '& .title': {
        padding: '3px!important'
      }
    },
    paddingLeft: '20px'
  });

const content = style({
  paddingLeft: '12px!important',
  paddingTop: '0px!important'
});

//const innerContent = style({
//   paddingLeft: '24px!important',
//   paddingTop: '0px!important'
// });

const long: any = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  flex: '1 100%',
  minWidth: '60px'
};

const bump = (bump: boolean) =>
  style({
    marginLeft: bump ? '-22px' : undefined,
    display: 'flex',
    $nest: {
      i: {
        flex: '1 auto!important',
        minWidth: '15px'
      },
      span: { ...long },
      a: { ...long },
      div: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
    }
  });

const bumpTitleSmall = style({
  marginLeft: '5px'
});

export type Props = {
  state: Luis.State;
  group?: TestGroup;
};

@observer
export class TestGroupView extends React.Component<Props> {
  render(): any {
    const { group, state } = this.props;

    if (
      (!state.showFailing && !state.showPassing) ||
      (state.showFailing == false && group.failingTests > 0 && group.passingTests == 0) ||
      (state.showPassing == false && group.passingTests > 0 && group.failingTests == 0)
    ) {
      return false;
    }

    const isList = state.config.storyView === 'list';
    const name = isList ? group.path : group.name;

    return (
      <div>
        <Accordion.Title
          key={group.name}
          active={state.isExpanded(group).get()}
          className={group.groups.length || group.tests.length ? bump(true) : bump(false)}
          onClick={e => state.toggleExpanded(e, group)}
        >
          {group.groups.length || group.tests.length ? (
            <Icon name="dropdown" className={bumpTitleSmall} />
          ) : (
            false
          )}
          {group.component ? (
            <span>
              <a
                href={`?stories=${group.id}`}
                onClick={e => state.viewState.openStoryFromList(e, group.id)}
              >
                {name}
              </a>
            </span>
          ) : (
            <span>{name}</span>
          )}

          <div className={timing(group.color)}>
            {group.duration.toString()}
            ms
          </div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(group).get()} className={content}>
          {!isList &&
            group.groups.map(g => <TestGroupView state={state} group={g} key={g.fileName} />)}
          {group.tests.map(t => (
            <TestView state={state} test={t} key={t.name} />
          ))}
        </Accordion.Content>
      </div>
    );
  }
}

// {this.props.state.liveRoot.groups.map((g, i) => <TestGroupView key={i} group={g} />)}

export const StoryList = observer(({ state }: Props) => {
  const isList = state.config.storyView === 'list';
  let version = state.liveRoot.version;
  if (state.liveRoot.groups.length === 0) {
    return <div>There are no tests</div>;
  }
  return (
    <Accordion className={pane()}>
      {isList
        ? state.liveRoot.nestedGroupsWithTests.map(g => (
            <TestGroupView state={state} group={g} key={g.fileName + version} />
          ))
        : state.liveRoot.groups.map(g => (
            <TestGroupView state={state} group={g} key={g.fileName + version} />
          ))}
    </Accordion>
  );
});
