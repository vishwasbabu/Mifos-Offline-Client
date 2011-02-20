package com.confluxtechnologies.mifos;

import java.io.IOException;

import net.sf.json.JSON;
import net.sf.json.xml.XMLSerializer;

import org.basex.core.Context;
import org.basex.core.cmd.CreateDB;
import org.basex.core.cmd.List;
import org.basex.core.cmd.Open;
import org.basex.data.Result;
import org.basex.query.QueryException;
import org.basex.query.QueryProcessor;

public class BaseXUtils {

	Context context = new Context();

	public boolean init() {
		try {
			System.out.println("\n* Show existing databases:"
					+ new List().execute(context));
			if (!new List().execute(context).contains("flamingo")) {
				// Create Flamingo DB
				System.out.println("\n* Create a database.");
				new CreateDB("flamingo",
						"<Branch><name>Uninitialized</name><Personnels></Personnels></Branch>")
						.execute(context);
			}
			new Open("flamingo").execute(context);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	protected void finalize() throws Throwable {
		// TODO Auto-generated method stub
		super.finalize();
		context.close();
	}

	public JSON process(final String query) throws QueryException, IOException {
		// ------------------------------------------------------------------------
		// Create a query processor
		QueryProcessor proc = new QueryProcessor(query, context);

		// ------------------------------------------------------------------------
		// Execute the query
		Result result = proc.execute();

		// ------------------------------------------------------------------------
		// Print result as string.
		System.out.println(result);

		XMLSerializer xmlSerializer = new XMLSerializer();

		// ------------------------------------------------------------------------
		// Close the query processor
		proc.close();
		return xmlSerializer.read("<result>" + result.toString() + "</result>");
	}

	/*
	 * public static void main(String[] args) throws BaseXException,
	 * QueryException, IOException { System.out.println("Datta"); BaseXUtils
	 * baseXUtils = new BaseXUtils(); String a = "//Branch";
	 * System.out.println(a);
	 * 
	 * System.out.println(baseXUtils.process(a)); baseXUtils.context.close(); }
	 */

}
