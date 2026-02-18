<template>
	<div>
		<van-nav-bar :title="$t('login.login')" />
		<van-form @submit="onSubmit">
			<van-cell-group inset>
				<van-field v-model="email" name="email" type="email" :label="$t('register.email')"
					:placeholder="$t('register.enter_email')" :rules="[
						{ required: true, message: $t('register.enter_email') },
						{ pattern: /.+@.+\..+/, message: $t('login.invalid_email_format') }
					]" />
				<van-field v-model="password" type="password" name="password" :label="$t('login.password')"
					:placeholder="$t('login.enter_password')"
					:rules="[{ required: true, message: $t('login.please_fill_password') }]" />
			</van-cell-group>
			<div class="flex-y-center">
				<div class="text-primary font-bold px-5 pt-2" @click="navigateTo(localePath('/register'))">
					{{ $t('login.register') }}
				</div>
				<div class="text-primary font-bold px-5 pt-2 ml-auto"
					@click="navigateTo(localePath('/change-password'))">
					{{ $t('login.forgot_password') }}
				</div>
			</div>
			<div style="margin: 16px">
				<van-button round block type="primary" color="#F88379" native-type="submit">{{ $t('login.login')
				}}</van-button>
			</div>
			<div class="flex-center m-16">
				<GoogleSignInButton size="large" type="standard" @success="handleGoogleLogin"
					@error="handleGoogleLoginError"></GoogleSignInButton>
			</div>
		</van-form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login, loginWithGoogle } from '../api/user'
import { useStorage } from '@vueuse/core'
import { GoogleSignInButton } from 'vue3-google-signin'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const localePath = useLocalePath()
const email = ref('')
const password = ref('')
const storedUsername = useStorage('username', '')

const onSubmit = async (values: any) => {
	const res = await login({
		email: values.email,
		password: values.password,
	})
	if (res.success) {
		storedUsername.value = values.email
		showToast(t('login.login_success'))
		navigateTo('/')
	}
}

const handleGoogleLogin = async (response: any) => {
	const { credential } = response
	if (!credential) {
		return handleGoogleLoginError()
	}
	try {
		const res = await loginWithGoogle(credential)
		if (res.success) {
			showToast(t('login.google_login_success'))
			navigateTo('/')
		} else {
			handleGoogleLoginError()
		}
	} catch (error) {
		handleGoogleLoginError()
	}
}

const handleGoogleLoginError = () => {
	console.error('Google 登入失敗')
	showToast(t('login.google_login_fail'))
}
</script>
