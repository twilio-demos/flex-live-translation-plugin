import { FlexPlugin } from "@twilio/flex-plugin";
import * as Flex from "@twilio/flex-ui";

import { Conversation } from "./components/conversation/conversation";

const PLUGIN_NAME = "LiveTranslation";

export default class LiveTranslation extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const options: Flex.ContentFragmentProps = { sortOrder: 100 };
    flex.TaskCanvasTabs.Content.add(
      <Flex.Tab
        key="LiveTranslation-tab"
        label="Live Translation"
        icon="AgentsBold">
        <Conversation />
      </Flex.Tab>,
      options
    );
  }
}
