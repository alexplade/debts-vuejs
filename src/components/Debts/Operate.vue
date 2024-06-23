<script lang="ts" setup>
// Imports
import { reactive, ref } from 'vue';

import Snackbar from '@/components/Snackbar.vue';
import { ISnackbarComponent, IUser } from '@/interfaces';

// Enums
enum RadioOptions {
  GIVE,
  GET,
}

// Props
interface IOperateProps {
  users: IUser[];
  addDebt: Function;
  loadHomeInfo: Function;
}

const props = defineProps<IOperateProps>();

// Data
const form = ref<boolean>(false);
const loading = ref<boolean>(false);
const person = ref<string>();
const radios = ref<RadioOptions>(RadioOptions.GIVE);
const amount = ref<number>();
const snackbar = reactive<ISnackbarComponent>({ success: true, message: '', active: false, timeout: -1 });

const onSubmit = async (): Promise<void> => {
  if (!form.value) return;
  loading.value = true;
  snackbar.active = false;
  
  const addDebtDto = { withUserId: person.value!, quantity: getQuantityByRadioValue() };
  const { ok, message } = await props.addDebt(addDebtDto);

  snackbar.success = ok;
  snackbar.message = message;
  snackbar.active = true;
  snackbar.timeout = ok ? 3000 : -1;

  await props.loadHomeInfo();
  loading.value = false;
};

const getQuantityByRadioValue = (): number => (
  radios.value === RadioOptions.GET
    ? -amount.value!
    : amount.value!
);

// Validators
const required = (v: boolean): boolean | string => !!v || 'Field is required';
const validateAmount = (value: number): boolean | string => value > 0 || 'Invalid amount';
const validatePerson = (_id: string): boolean | string => (
  props.users.some(u => u._id === _id) || 'Select a valid person'
);
</script>

<template>
  <h2 class="mb-4">
    Operate
  </h2>

  <v-form
    v-model="form"
    @submit.prevent="onSubmit"
  >
    <div class="text-subtitle-2 text-medium-emphasis">
      Person
    </div>

    <v-autocomplete
      v-model="person"
      :items="users"
      item-title="username"
      item-value="_id"
      :rules="[required, validatePerson]"
      variant="solo"
      density="comfortable"
      placeholder="Select a person"
    />

    <div class="mt-2 text-subtitle-2 text-medium-emphasis">
      Operation
    </div>

    <v-radio-group v-model="radios">
      <v-radio
        label="I give"
        :value="RadioOptions.GIVE"
      />
      <v-radio
        label="I get"
        :value="RadioOptions.GET"
      />
    </v-radio-group>

    <div class="mt-2 text-subtitle-2 text-medium-emphasis">
      Amount
    </div>

    <v-text-field
      v-model="amount"
      :rules="[required, validateAmount]"
      variant="solo"
      type="number"
      density="comfortable"
      placeholder="Enter an amount"
    />

    <v-btn
      :disabled="!form"
      :loading="loading"
      class="text-body-1 mt-4 mb-12"
      block
      density="comfortable"
      color="primary"
      type="submit"
      size="x-large"
      variant="flat"
    >
      Submit
    </v-btn>
  </v-form>

  <Snackbar
    :snackbar="snackbar"
    @close="snackbar.active = false"
  />
</template>