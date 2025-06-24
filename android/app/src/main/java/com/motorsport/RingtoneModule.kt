package com.motorsport

import android.content.Context
import android.telephony.TelephonyManager
import android.content.ContentValues
import android.content.Intent
import android.media.RingtoneManager
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.*
import java.io.File

class RingtoneModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RingtoneModule"
    private val TAG = "RingtoneModule"

    @ReactMethod
    fun copyAssetToExternalStorage(assetName: String, promise: Promise) {
        try {
            Log.d(TAG, "Attempting to copy asset: $assetName")
            val inputStream = reactContext.assets.open("audio/$assetName")
            val outFile = File(reactContext.getExternalFilesDir(null), assetName)
            Log.d(TAG, "Target file path: ${outFile.absolutePath}")

            inputStream.use { input ->
                outFile.outputStream().use { output ->
                    input.copyTo(output)
                }
            }

            Log.i(TAG, "Asset copied to: ${outFile.absolutePath}")
            promise.resolve(outFile.absolutePath)
        } catch (e: Exception) {
            Log.e(TAG, "Error copying asset", e)
            promise.reject("COPY_FAILED", "Failed to copy asset: $assetName", e)
        }
    }

    @ReactMethod
    fun setRingtone(filePath: String) {
        Log.d(TAG, "Setting ringtone from file: $filePath")
        try {
            val file = File(filePath)
            if (!file.exists()) {
                Log.e(TAG, "File does not exist: $filePath")
                return
            }

            val contentValues = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, "BrewerTone")
                put(MediaStore.MediaColumns.MIME_TYPE, "audio/mp3")
                put(MediaStore.MediaColumns.RELATIVE_PATH, "Ringtones/")
                put(MediaStore.Audio.Media.IS_RINGTONE, true)
            }

            val resolver = reactContext.contentResolver
            val audioUri = MediaStore.Audio.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            val newUri = resolver.insert(audioUri, contentValues)

            if (newUri == null) {
                Log.e(TAG, "Failed to insert into MediaStore")
                return
            }

            Log.i(TAG, "MediaStore URI: $newUri")

            val inputStream = file.inputStream()
            val outputStream = resolver.openOutputStream(newUri)
            inputStream.use { input ->
                outputStream?.use { output ->
                    input.copyTo(output)
                } ?: Log.e(TAG, "Failed to open output stream to $newUri")
            }

            RingtoneManager.setActualDefaultRingtoneUri(
                reactContext,
                RingtoneManager.TYPE_RINGTONE,
                newUri
            )

            Log.i(TAG, "New ringtone successfully set: $newUri")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to set ringtone", e)
        }
    }

    @ReactMethod
    fun canWriteSettings(promise: Promise) {
        Log.d(TAG, "Checking WRITE_SETTINGS permission")
        try {
            val canWrite = Settings.System.canWrite(reactContext)
            Log.d(TAG, "canWriteSettings = $canWrite")
            promise.resolve(canWrite)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check WRITE_SETTINGS", e)
            promise.reject("ERROR", "Failed to check WRITE_SETTINGS", e)
        }
    }

    @ReactMethod
    fun openWriteSettingsIntent() {
        Log.d(TAG, "Opening WRITE_SETTINGS settings page")
        try {
            val intent = Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS).apply {
                data = Uri.parse("package:" + reactContext.packageName)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open WRITE_SETTINGS intent", e)
        }
    }

    @ReactMethod
    fun getSimCount(promise: Promise) {
        try {
            val tm = reactContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            val simCount = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                tm.phoneCount
            } else {
                1
            }
            Log.d("RingtoneModule", "Active SIM count: $simCount")
            promise.resolve(simCount)
        } catch (e: Exception) {
            Log.e("RingtoneModule", "Failed to get SIM count", e)
            promise.reject("SIM_COUNT_ERROR", "Could not fetch SIM count", e)
        }
    }

    @ReactMethod
    fun openRingtoneSettingsWithPath(filePath: String) {
        try {
            val activity = currentActivity
            if (activity == null) {
                Log.e("RingtoneModule", "Activity is null, can't show AlertDialog")
                return
            }

            activity.runOnUiThread {
                val builder = android.app.AlertDialog.Builder(activity)
                builder.setTitle("Set Ringtone")
                builder.setMessage("Go to 'Phone Ringtone' and select:\n$filePath")
                builder.setPositiveButton("OK") { _, _ ->
                    try {
                        val intent = Intent(Settings.ACTION_SOUND_SETTINGS)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                        reactContext.startActivity(intent)
                        Log.d("RingtoneModule", "Opened ringtone settings with file hint.")
                    } catch (e: Exception) {
                        Log.e("RingtoneModule", "Failed to open ringtone settings", e)
                    }
                }
                builder.setNegativeButton("Cancel", null)
                builder.show()
            }
        } catch (e: Exception) {
            Log.e("RingtoneModule", "Error showing AlertDialog or opening settings", e)
        }
    }

}
