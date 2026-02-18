<template>
	<div class="w-full mx-auto pt-2">
		<van-form ref="formRef" @submit="onSubmit" class="shadow-2xl">
			<van-cell-group class="!rounded-xl overflow-hidden">
				<van-field v-model="form.stockSymbol" name="stockSymbol" :label="$t('transaction.stock_id')"
					:placeholder="$t('transaction.enter_stock_id')"
					:rules="[{ required: true, message: $t('transaction.enter_stock_id') }]" />

				<van-field name="tradeType" :label="$t('transaction.transaction_type')">
					<template #input>
						<van-radio-group v-model="form.tradeType" direction="horizontal">
							<van-radio name="buy" checked-color="#F88379">
								<span class="text-green-600">{{ $t('transaction.buy') }}</span>
							</van-radio>
							<van-radio name="sell" checked-color="#F88379">
								<span class="text-red-600">{{ $t('transaction.sell') }}</span>
							</van-radio>
						</van-radio-group>
					</template>
				</van-field>

				<van-field v-model="form.quantity" type="digit" name="quantity" :label="$t('transaction.quantity')"
					:placeholder="$t('transaction.enter_quantity')" :rules="[
						{ required: true, message: $t('transaction.enter_quantity') },
						{ pattern: /^[1-9]\d*$/, message: $t('transaction.enter_positive_integer') },
					]" />

				<van-field v-model="form.price" type="number" name="price" :label="$t('transaction.price')"
					:placeholder="$t('transaction.enter_price')" :rules="[
						{ required: true, message: $t('transaction.enter_price') },
						{ pattern: /^\d+(\.\d{1,2})?$/, message: $t('transaction.enter_correct_price_format') },
					]" />

				<van-field v-model="form.tradeDate" is-link readonly name="tradeDate"
					:label="$t('transaction.transaction_date')" :placeholder="$t('transaction.select_transaction_date')"
					:rules="[{ required: true, message: $t('transaction.select_transaction_date') }]"
					@click="showDatePicker = true" />
			</van-cell-group>
			<van-popup v-model:show="showDatePicker" position="bottom" round>
				<van-date-picker v-model="currentDate" :title="$t('transaction.select_transaction_date')"
					:min-date="minDate" :max-date="maxDate" @confirm="onConfirmDate" @cancel="showDatePicker = false" />
			</van-popup>
			<!-- button要放這裡才能讓van-form的驗證生效 -->
			<div class="px-2 py-5">
				<van-button round block type="primary" color="#F88379" native-type="submit">
					{{ $t('transaction.record') }}
				</van-button>
			</div>
		</van-form>

		<van-notice-bar wrapable :scrollable="false" type="warning" class="mb-2">
			{{ $t('transaction.img_upload_tips') }}
		</van-notice-bar>

		<div class="rounded-lg flex items-center justify-center text-primary border border-[#f88379] mt-2 w-[95%] h-44 mx-auto cursor-pointer"
			@click="navigateTo(localePath('/trade-screenshot'))">
			{{ $t('transaction.upload_screenshot') }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'vant'
import { transactionApi } from '../api/transaction'
import emitter from '~/utils/emitter'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import type { TradeParams } from '@/types/trade'

const { t } = useI18n()
const localePath = useLocalePath()
const userStore = useUserStore()

const getInitialFormState = (): TradeParams => ({
	stockSymbol: '',
	tradeType: 'buy',
	quantity: '',
	price: '',
	tradeDate: new Date().toISOString().split('T')[0] as string,
})

const formRef = ref<FormInstance>()
const form = ref<TradeParams>(getInitialFormState())

const showDatePicker = ref(false)
const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
const maxDate = new Date()
const currentDate = ref(form.value.tradeDate.split('-'))

const onConfirmDate = ({ selectedValues }: { selectedValues: string[] }) => {
	form.value.tradeDate = selectedValues.join('-')
	showDatePicker.value = false
}

const onSubmit = async () => {
	if (!formRef.value) return
	if (!userStore.isLogin) {
		showToast(t('transaction.please_login_first'))
		return
	}

	try {
		await formRef.value?.validate()
		const payload = {
			...form.value,
			quantity: form.value.quantity,
			price: form.value.price,
		}
		await transactionApi.recordMyTransactions(payload)
		showToast({
			type: 'success',
			message: t('transaction.transaction_saved'),
		})

		// 刷新交易紀錄和投資組合頁面
		emitter.emit('refresh', 'records')
		emitter.emit('refresh', 'portfolio')
		form.value = getInitialFormState()
		formRef.value?.resetValidation()
	} catch (error) {
		console.error(error)
		showFailToast(t('transaction.check_input_data'))
	}
}
</script>
