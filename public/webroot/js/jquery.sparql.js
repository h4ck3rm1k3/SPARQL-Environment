(function( $ ) {
	 
    $.fn.query = function(query ,options) {
		if (options) {
	 	   	var opts = $.extend( {}, $.fn.defaults, options);
	        $.fn.defaults = opts;
		}
		query = this.prefixesAsString() + query;
		var json_string = $.ajax(
		        {
		           url: $.fn.defaults.source, 
				   data: {"query":query,"output":"json"},
				   type: "GET",
		           async: false, 
		           dataType: 'json'
		        }
		    ).responseText;
		if (json_string.indexOf('Error') == -1) {
			var json = $.parseJSON(json_string);
			return json.results.bindings;
		}
		//ERROR
		
		return {"error":true,"response":json_string}; //evenutally parse code and other data
		
	}
	
	//This needs to be verbsForSubject and versbForObject then added back to original repository.
	
	$.fn.verbsForObject = function (object) {
		var results = $(this).query('SELECT distinct ?v where {'+object+' ?v ?o.}');
		var verbs = new Array();
		
		for (i = 0; i < results.length; i++) {
			verbs.push(results[i].v);
		}
		return verbs;
	}
	
	$.fn.verbsForDirectObject = function (object) {
		var results = $(this).query('SELECT distinct ?v where {?o ?v '+ object +'.}');
		var verbs = new Array();
		
		for (i = 0; i < results.length; i++) {
			verbs.push(results[i].v);
		}
		return verbs;
	}
	
	$.fn.resolvePrefix = function (str) {
		for (var key in $.fn.defaults.prefixes) {
			var prefix = $.fn.defaults.prefixes[key];
			if (str.indexOf(prefix) == 0) {
				return key+str.substr(prefix.length);
			}
		}
		return str;
	}
	
	$.fn.prefixesAsString = function () {
		var str = "";
		$.each($.fn.defaults.prefixes, function (key, value) {
			str += "prefix "+key+" <"+value+"> ";
		});
		return str;
	}
	
//	$.fn.query.prefixString = function() {
		
//	}
	
	// Plugin defaults
	$.fn.defaults = {
		"source":"http://localhost:3030/ds/", //Defualt source to use out of the sources
		"prefix":"prefix cts: <http://www.homermultitext.org/cts/rdf/> prefix cite: <http://www.homermultitext.org/cite/rdf/> prefix hmt: <http://www.homermultitext.org/hmt/rdf/> prefix citedata: <http://www.homermultitext.org/hmt/citedata/> prefix dcterms: <http://purl.org/dc/terms/> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix  xsd: <http://www.w3.org/2001/XMLSchema#> prefix olo: <http://purl.org/ontology/olo/core#>",
		"prefixes":{
			'cts:':'http://www.homermultitext.org/cts/rdf/',
			'cite:': 'http://www.homermultitext.org/cite/rdf/',
			'hmt:': 'http://www.homermultitext.org/hmt/rdf/',
			'citedata:': 'http://www.homermultitext.org/hmt/citedata/',
			'dcterms:':'http://purl.org/dc/terms/',
			'rdf:':'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
			'olo:':'http://purl.org/ontology/olo/core#'
		}
	};
	
	
}( jQuery ));

