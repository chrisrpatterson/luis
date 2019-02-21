export { renderLuis, Luis } from './client/components/index';
export { StateModel, mapBridgeToState } from './client/models/state_model';
export { Test } from './client/models/test_model';
export { TestGroup } from './client/models/test_group_model';
export { Snapshot } from './client/models/snapshot_model';
export { ProxyStore } from './client/models/proxy_store';
export { buildBridge } from './bridge';

declare global {
  interface StoryConfig {
    [index: string]: any;
    component?: React.ComponentType;
    info?: string;
    cssClassName?: string;
    componentWithData?(
      ...props: any[]
    ):
      | JSX.Element
      | {
          [index: string]: any;
          component: JSX.Element;
          documentRoot?: HTMLElement;
        };
  }
}
