package com.doctoolz.app;

import android.app.Activity;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String TAG = "DocToolz";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;
    private static final String APP_HOST = "doctoolz.app";

    private WebView mWebView;
    private ValueCallback<Uri[]> mUploadCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure system window appearance
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#FFFFFF"));
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }

        FrameLayout container = new FrameLayout(this);
        container.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        mWebView = new WebView(this);
        mWebView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        mWebView.setBackgroundColor(Color.parseColor("#FFFFFF"));

        setupWebSettings(mWebView.getSettings());
        setupWebViewClients();

        mWebView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        container.addView(mWebView);
        setContentView(container);

        // Load the offline application bundle served as a secure origin
        mWebView.loadUrl("https://" + APP_HOST + "/index.html");
    }

    private void setupWebSettings(WebSettings settings) {
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            settings.setMediaPlaybackRequiresUserGesture(false);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }

    private void setupWebViewClients() {
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
                Log.e("DocToolzWeb", "Error loading " + request.getUrl() + ": " + error.getDescription());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri != null && APP_HOST.equalsIgnoreCase(uri.getHost())) {
                    String path = uri.getPath();
                    if (path == null || path.isEmpty() || "/".equals(path)) {
                        path = "/index.html";
                    }

                    // Remove leading slash for AssetManager
                    String assetPath = "www" + path;
                    AssetManager am = getAssets();
                    try {
                        InputStream is = am.open(assetPath);
                        String mimeType = getMimeType(path);
                        Map<String, String> headers = new HashMap<>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        headers.put("Cache-Control", "no-cache");
                        return new WebResourceResponse(mimeType, "UTF-8", 200, "OK", headers, is);
                    } catch (IOException e) {
                        Log.w("DocToolzWeb", "Asset not found: " + assetPath + " for uri " + uri);
                        // If file not found and request does not have an extension, fallback to index.html (SPA)
                        if (!path.contains(".")) {
                            try {
                                InputStream is = am.open("www/index.html");
                                Map<String, String> headers = new HashMap<>();
                                headers.put("Access-Control-Allow-Origin", "*");
                                return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, is);
                            } catch (IOException ignored) {}
                        }
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                Log.d("DocToolzJS", consoleMessage.message() + " -- Line "
                        + consoleMessage.lineNumber() + " of "
                        + consoleMessage.sourceId());
                return true;
            }
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (mUploadCallback != null) {
                    mUploadCallback.onReceiveValue(null);
                    mUploadCallback = null;
                }
                mUploadCallback = filePathCallback;

                Intent intent = null;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    intent = fileChooserParams.createIntent();
                } else {
                    intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");
                }

                if (fileChooserParams.getMode() == WebChromeClient.FileChooserParams.MODE_OPEN_MULTIPLE) {
                    intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                }

                try {
                    startActivityForResult(Intent.createChooser(intent, "Select File / Image"), FILE_CHOOSER_REQUEST_CODE);
                } catch (Exception e) {
                    mUploadCallback = null;
                    Toast.makeText(MainActivity.this, "Cannot open file picker", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });

        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                if (url != null && url.startsWith("data:")) {
                    new AndroidBridge().saveBase64(url, "download_" + System.currentTimeMillis());
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (mUploadCallback == null) return;
            Uri[] results = null;
            if (resultCode == RESULT_OK && data != null) {
                String dataString = data.getDataString();
                ClipData clipData = data.getClipData();
                if (clipData != null && clipData.getItemCount() > 0) {
                    results = new Uri[clipData.getItemCount()];
                    for (int i = 0; i < clipData.getItemCount(); i++) {
                        results[i] = clipData.getItemAt(i).getUri();
                    }
                } else if (dataString != null) {
                    results = new Uri[]{Uri.parse(dataString)};
                }
            }
            mUploadCallback.onReceiveValue(results);
            mUploadCallback = null;
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null) {
            mWebView.evaluateJavascript(
                "(function() { return (typeof window.onAndroidBackPressed === 'function') ? window.onAndroidBackPressed() : false; })()",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (!"true".equalsIgnoreCase(value)) {
                            MainActivity.super.onBackPressed();
                        }
                    }
                }
            );
            return;
        }
        super.onBackPressed();
    }

    private String getMimeType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".wasm")) return "application/wasm";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".txt")) return "text/plain";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";
        if (lower.endsWith(".ttf")) return "font/ttf";
        return "application/octet-stream";
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void saveBase64(final String dataUriOrBase64, final String filename) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String payload = dataUriOrBase64;
                        String detectedMime = "application/octet-stream";

                        if (payload.contains(",")) {
                            int commaIndex = payload.indexOf(",");
                            String header = payload.substring(0, commaIndex);
                            payload = payload.substring(commaIndex + 1);
                            if (header.contains(":") && header.contains(";")) {
                                detectedMime = header.substring(header.indexOf(":") + 1, header.indexOf(";"));
                            }
                        }

                        byte[] data = Base64.decode(payload, Base64.DEFAULT);
                        String safeFilename = (filename == null || filename.trim().isEmpty())
                                ? ("DocToolz_" + System.currentTimeMillis())
                                : filename.replaceAll("[^a-zA-Z0-9._-]", "_");

                        boolean success = saveFileToDownloads(safeFilename, detectedMime, data);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (success) {
                                    Toast.makeText(MainActivity.this, "✅ File saved to Downloads: " + safeFilename, Toast.LENGTH_LONG).show();
                                } else {
                                    Toast.makeText(MainActivity.this, "⚠️ Failed to save file", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
                    } catch (Exception e) {
                        Log.e(TAG, "Error saving file: " + e.getMessage(), e);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, "Error saving: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }
                }
            }).start();
        }

        private boolean saveFileToDownloads(String filename, String mimeType, byte[] data) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                    values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
                    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/DocToolz");
                    values.put(MediaStore.Downloads.IS_PENDING, 1);

                    ContentResolver resolver = getContentResolver();
                    Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri == null) return false;

                    try (OutputStream os = resolver.openOutputStream(uri)) {
                        if (os != null) {
                            os.write(data);
                            os.flush();
                        }
                    }

                    values.clear();
                    values.put(MediaStore.Downloads.IS_PENDING, 0);
                    resolver.update(uri, values, null, null);
                    return true;
                } else {
                    File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    File appDir = new File(downloadsDir, "DocToolz");
                    if (!appDir.exists()) {
                        appDir.mkdirs();
                    }
                    File outFile = new File(appDir, filename);
                    try (FileOutputStream fos = new FileOutputStream(outFile)) {
                        fos.write(data);
                        fos.flush();
                    }
                    MediaScannerConnection.scanFile(MainActivity.this, new String[]{outFile.getAbsolutePath()}, new String[]{mimeType}, null);
                    return true;
                }
            } catch (Exception e) {
                Log.e(TAG, "Failed saving file to downloads", e);
                return false;
            }
        }

        @JavascriptInterface
        public void clearAppCache() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if (mWebView != null) {
                            mWebView.clearCache(true);
                            mWebView.clearFormData();
                            mWebView.clearHistory();
                            mWebView.clearSslPreferences();
                        }
                        File cacheDir = getCacheDir();
                        deleteDir(cacheDir);
                        File codeCacheDir = getCodeCacheDir();
                        deleteDir(codeCacheDir);
                        Toast.makeText(MainActivity.this, "🧹 All App Cache Cleared Successfully", Toast.LENGTH_SHORT).show();
                    } catch (Exception e) {
                        Log.e(TAG, "Error clearing cache: " + e.getMessage());
                    }
                }
            });
        }

        private boolean deleteDir(File dir) {
            if (dir != null && dir.isDirectory()) {
                String[] children = dir.list();
                if (children != null) {
                    for (String child : children) {
                        boolean success = deleteDir(new File(dir, child));
                        if (!success) return false;
                    }
                }
                return dir.delete();
            } else if (dir != null && dir.isFile()) {
                return dir.delete();
            }
            return false;
        }

        @JavascriptInterface
        public void shareFile(final String dataUriOrBase64, final String filename) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String payload = dataUriOrBase64;
                        String detectedMime = "image/jpeg";

                        if (payload.contains(",")) {
                            int commaIndex = payload.indexOf(",");
                            String header = payload.substring(0, commaIndex);
                            payload = payload.substring(commaIndex + 1);
                            if (header.contains(":") && header.contains(";")) {
                                detectedMime = header.substring(header.indexOf(":") + 1, header.indexOf(";"));
                            }
                        }

                        byte[] data = Base64.decode(payload, Base64.DEFAULT);
                        String safeFilename = (filename == null || filename.trim().isEmpty())
                                ? ("DocToolz_" + System.currentTimeMillis() + (detectedMime.contains("pdf") ? ".pdf" : ".jpg"))
                                : filename.replaceAll("[^a-zA-Z0-9._-]", "_");

                        File sharedDir = new File(getCacheDir(), "shared");
                        if (!sharedDir.exists()) sharedDir.mkdirs();
                        File tempFile = new File(sharedDir, safeFilename);
                        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                            fos.write(data);
                            fos.flush();
                        }

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            try {
                                android.os.StrictMode.VmPolicy.Builder builder = new android.os.StrictMode.VmPolicy.Builder();
                                android.os.StrictMode.setVmPolicy(builder.build());
                            } catch (Exception ignored) {}
                        }

                        Intent intent = new Intent(Intent.ACTION_SEND);
                        intent.setType(detectedMime);
                        intent.putExtra(Intent.EXTRA_SUBJECT, safeFilename);
                        intent.putExtra(Intent.EXTRA_TEXT, "Shared from DocToolz");
                        intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(tempFile));
                        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(Intent.createChooser(intent, "Share Document"));
                    } catch (Exception e) {
                        Log.e(TAG, "Error sharing file: " + e.getMessage(), e);
                    }
                }
            }).start();
        }
    }
}
