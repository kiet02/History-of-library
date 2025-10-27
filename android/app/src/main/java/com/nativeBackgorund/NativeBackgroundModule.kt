
package com.nativeBackground

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NativeBackgroundModule(
    private val reactCtx: ReactApplicationContext
) : ReactContextBaseJavaModule(reactCtx) {

    companion object {
        const val NAME = "NativeLocalStorage"
        private const val PREFS_NAME = "NativeLocalStorage"
    }

    override fun getName(): String = NAME

    private val prefs by lazy {
        reactCtx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    @ReactMethod
    fun setString(key: String, value: String, promise: Promise) {
        try {
            prefs.edit().putString(key, value).apply()
            promise.resolve(true)
        } catch (t: Throwable) {
            promise.reject("E_SET_STRING", t)
        }
    }

    @ReactMethod
    fun getString(key: String, defaultValue: String?, promise: Promise) {
        try {
            // getString trả về String? → ép về String (không null) để resolve
            val v: String = prefs.getString(key, defaultValue) ?: (defaultValue ?: "")
            promise.resolve(v)
        } catch (t: Throwable) {
            promise.reject("E_GET_STRING", t)
        }
    }

    @ReactMethod
    fun remove(key: String, promise: Promise) {
        try {
            prefs.edit().remove(key).apply()
            promise.resolve(true)
        } catch (t: Throwable) {
            promise.reject("E_REMOVE", t)
        }
    }

    @ReactMethod
    fun clear(promise: Promise) {
        try {
            prefs.edit().clear().apply()
            promise.resolve(true)
        } catch (t: Throwable) {
            promise.reject("E_CLEAR", t)
        }
    }
}
