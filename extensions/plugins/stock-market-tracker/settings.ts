/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [
  {
    label: 'crypto_symbol',
    group: 'default',
    type: SettingType.text,
    value: '', // Default is empty, allowing the user to set any cryptocurrency
  },
  {
    label: 'currency',
    group: 'default',
    type: SettingType.text,
    value: 'usd', // Default currency to convert crypto to (USD)
  },
  {
    label: 'context',
    group: 'default',
    type: SettingType.textarea,
    value:
      'You are a cryptocurrency assistant providing real-time cryptocurrency information.',
    translatable: true,
  },
] as const satisfies PluginSetting[];
