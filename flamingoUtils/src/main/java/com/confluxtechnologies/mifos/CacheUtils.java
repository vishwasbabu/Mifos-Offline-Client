package com.confluxtechnologies.mifos;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class CacheUtils {
	private static final String PATHNAME = System.getProperty("user.home")
			+ "/" + ".flamingo";
	private static final String USERFILENAME = "users.properties";

	private Properties cache;

	public CacheUtils() throws IOException {
		cache = new Properties();
		if (!new File(PATHNAME).isDirectory()) {
			new File(PATHNAME).mkdir();
		}
		File file = new File(PATHNAME + "/" + USERFILENAME);
		file.createNewFile();
		cache.load(new FileInputStream(file));
	}

	public void updateCache(String username, String password,
			String mifosURLKey, String mifosURL) throws FileNotFoundException,
			IOException {
		cache.setProperty(username, password);
		cache.setProperty(mifosURLKey, mifosURL);
		cache.store(new FileOutputStream(
				new File(PATHNAME + "/" + USERFILENAME)), null);
	}

	public String getValueForKey(String username) {
		return cache.get(username).toString();
	}

}
