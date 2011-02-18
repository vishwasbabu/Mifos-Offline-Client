package org.conflux.mifos;

/**
 * Created by Eclipse.
 * User: conflux
 * Date: 12/26/10
 * Time: 7:59 AM
 * To change this template use File | Settings | File Templates.
 */

import net.sf.json.JSON;
import net.sf.json.xml.XMLSerializer;
import org.xmldb.api.DatabaseManager;
import org.xmldb.api.base.*;
import org.xmldb.api.modules.XPathQueryService;

public class XMLDBQuery {


    /**
     * Database driver.
     */
    private static final String DRIVER = "org.basex.api.xmldb.BXDatabase";
    /**
     * Name of the referenced database.
     */
    private XPathQueryService service;


    /**
     * Seems to be some issues with LiveConnect, hence unable to call Overloaded constructor through reflection, temporary workaround*
     *
     * @param dbConnectionURL
     * @return
     */
    public boolean setUpObject(String dbConnectionURL) {
        try {
            Class<?> c = Class.forName(DRIVER);
            Database db = (Database) c.newInstance();
            DatabaseManager.registerDatabase(db);
            Collection coll = DatabaseManager.getCollection(dbConnectionURL);
            service = (XPathQueryService)
                    coll.getService("XPathQueryService", "1.0");
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * Method returns a JSON of executing an XQuery on the target xmlDB
     *
     * @param query
     * @return
     */
    public JSON executeXQuery(String query) {
        StringBuilder str = new StringBuilder();
        try {
            ResourceSet
                    set = service.query(query);
            // Create a result iterator.
            ResourceIterator iter = set.getIterator();
            // Loop through all result items.
            while (iter.hasMoreResources()) {
                // Receive the next results.
                Resource res = iter.nextResource();
                // append result
                str.append(res.getContent());
            }

        } catch (XMLDBException ex) {
            // Handle exceptions.
            System.err.println("XML:DB Exception occured " + ex.errorCode);
        }
        XMLSerializer xmlSerializer = new XMLSerializer();
        return xmlSerializer.read("<result>" + str.toString() + "</result>");
    }


}


